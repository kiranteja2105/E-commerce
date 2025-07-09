// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update product
router.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, count, description, image_url } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, count, description, image_url },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
