const mongoose = require('mongoose');

// Define the Product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    price: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        required: true
    },
    cat: {
        type: String,
        required: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    image_url: {
        type: String,
        required: true,
        maxlength: 255
    }
});

// Avoid overwriting the model if it already exists
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;