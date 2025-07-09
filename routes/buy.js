const express = require('express');
const Order = require('../models/Order'); // Import your Order model
const Cart = require('../models/Cart'); // Import your Cart model
const router = express.Router();

// Route to handle order submission
router.post('/buy', async (req, res) => {
    const { totalPrice, address } = req.body; // Extract data from request body
    const username = req.session.user?.username; // Assuming user info is stored in session
    const email = req.session.user?.email; // Get email from session
    const phone = req.session.user?.mobile; // Get mobile from session

    if (!username || !email || !phone) {
        return res.status(400).json({ message: "User not logged in." });
    }

    try {
        // Fetch cart items for the user
        const cartItems = await Cart.find({ username });

        // Create a new order with additional address field
        const newOrder = new Order({
            username,
            email,
            phone,
            address, // Include address from the form
            products: cartItems,
            totalPrice,
            date: new Date() // Add a date field for the order
        });

        // Save the order
        await newOrder.save();

        // Clear the cart after saving the order
        await Cart.deleteMany({ username });

        // Redirect to account page after successful order submission
        res.redirect('/acc'); // Adjust this to your route for the account page
    } catch (error) {
        console.error("Error submitting order:", error);
        res.status(500).json({ message: "Error processing order." });
    }
});

module.exports = router;
