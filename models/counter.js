const mongoose = require('mongoose');

// Define the Counter schema
const counterSchema = new mongoose.Schema({
    sequenceValue: {
        type: Number,
        default: 0
    }
});

// Create a model from the schema
const Counter = mongoose.model('Counter', counterSchema);

// Export the model
module.exports = Counter;
