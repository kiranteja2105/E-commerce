const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');  // Import your Cart model
const Product = require('../models/Product'); // Import your Product model
const router = express.Router();

// Route to handle adding a product to the cart
router.post('/add-to-cart', async (req, res) => {
  const { productId } = req.body; // Only get productId from body
  const username = req.session.user?.username; // Get username from session

  // Check if the username exists
  if (!username) {
    return res.status(400).json({ message: "User not logged in. Please log in to add items to the cart." });
  }

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.count <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    // Check if the product is already in the user's cart
    let cartItem = await Cart.findOne({ username, pid: productId });

    if (cartItem) {
      // Product already in cart, increment quantity
      cartItem.count += 1;
      await cartItem.save();
    } else {
      // Product not in cart, add it with quantity 1
      cartItem = new Cart({
        username: username, // Use the username from the session
        pid: productId,
        count: 1
      });
      await cartItem.save();
    }

    // Decrement the product count by 1
    product.count -= 1;
    await product.save();

    res.json({ message: "Product added to cart successfully", cartItem });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Route to handle getting cart items
router.get('/cart', async (req, res) => {
  const username = req.session.user?.username; // Get username from session

  // Check if the username exists
  if (!username) {
      return res.status(400).json({ message: "User not logged in." });
  }

  try {
      // Fetch cart items for the user
      const cartItems = await Cart.find({ username }).populate('pid'); // Assuming 'pid' is a reference to Product model
      res.json(cartItems); // Send cart items as response
  } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Server error", error });
  }
});







module.exports = router;
