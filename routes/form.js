const express = require('express');
const Order = require('../models/order'); // Ensure model name is lowercase
const Cart = require('../models/Cart'); // Ensure model name is lowercase
const router = express.Router();

// Route to handle order submission
router.post('/submit-order', async (req, res) => {
    const username = req.session.user?.username; // Get username from session
    const email = req.body.email; // Get this from the request body
    const mobile = req.body.phone; // Get this from the request body
    const address = req.body.address; // Get the address from the request body
    const totalPrice = req.body.totalPrice; // Get the total price from the request body

    if (!username) {
        return res.status(400).json({ message: "User not logged in." });
    }

    try {
        // Fetch cart items for the user
        const cartItems = await Cart.find({ username });

        // Create a new order
        const newOrder = new Order({
            username, // Use lowercase for consistency
            email,
            phone: mobile,
            address,
            products: cartItems,
            totalPrice,
            status: 'Pending'
        });

        await newOrder.save();

        // Clear the cart after saving the order
        await Cart.deleteMany({ username });

        // Redirect to acc.html after order submission
        res.redirect('/acc.html');
    } catch (error) {
        console.error("Error submitting order:", error);
        res.status(500).json({ message: "Error processing order." });
    }
});

module.exports = router;
