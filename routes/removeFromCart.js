const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart'); // Cart model
const Product = require('../models/Product'); // Product model
const router = express.Router();

router.delete('/remove-from-cart', async (req, res) => {
    const productId = req.query.productId;

    try {
        // Find the cart item with the specified product ID
        const cartItem = await Cart.findOne({ pid: productId });

        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Retrieve the quantity from the cart item
        const cartQuantity = cartItem.count;

        // Update the product's stock in the products collection
        await Product.findByIdAndUpdate(productId, { $inc: { count: cartQuantity } });

        // Remove the product from the cart
        await Cart.deleteOne({ pid: productId });

        res.json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
