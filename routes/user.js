const express = require('express');
const Order = require('../models/order');
const Product = require('../models/product'); // Ensure the Product model is imported
const router = express.Router();

router.get('/user-account', async (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ message: "User not logged in." });
    }

    try {
        // Fetch orders and sort by orderDate in descending order
        const orders = await Order.find({ username }).sort({ orderDate: -1 });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

       

        // Fetch product details based on the products in the orders
        const ordersWithProductDetails = await Promise.all(orders.map(async (order) => {
            const productsWithDetails = await Promise.all(order.products.map(async (productObj) => {
                const product = await Product.findById(productObj.pid); // Fetch product by ID
                return product ? {
                    name: product.name,
                    count: productObj.count || 0 // Use the count from the order
                } : { name: "Unnamed Product", count: productObj.count || 0 };
            }));

            return {
                orderId: order._id,
                products: productsWithDetails,
                totalPrice: order.totalPrice,
                status: order.status,
                orderDate: order.orderDate,
            };
        }));

        const userData = {
            username,
            email: orders[0].email,
            phone: orders[0].phone,
            address: orders[0].address,
            orders: ordersWithProductDetails
        };

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching user account data:", error);
        res.status(500).json({ message: "Error fetching user data." });
    }
});

module.exports = router;
