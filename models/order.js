const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, // Make sure it's required
    },
    email: {
        type: String,
        required: true, // Optional: set as required if necessary
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    products: [{
    pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model
    count: { type: Number, required: true } // Quantity ordered
}],
 // Ensure this is required if necessary

    status: { 
        type: String, 
        default: 'Pending' 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    }
});

// Conditional export to prevent overwriting
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
module.exports = Order;
