const express = require('express');
const Order = require('../models/Order'); // Import Order model
const router = express.Router();

// Route to get user account details and order history
router.get('/acc', async (req, res) => {
    const username = req.session.user?.username; // Assuming user is stored in session

    if (!username) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }

    try {
        const orders = await Order.find({ username }); // Fetch orders for the user
        const userDetails = { // Sample user details; adjust based on your session management
            name: req.session.user.username,
            email: req.session.user.email,
            mobile: req.session.user.mobile,
        };

        res.render('account', { userDetails, orders }); // Render account page with user details and orders
    } catch (error) {
        console.error("Error fetching account details:", error);
        res.status(500).send("Error fetching account details.");
    }
});

module.exports = router;
