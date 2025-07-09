const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the Cart schema
const cartSchema = new mongoose.Schema({
  cid: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    ref: 'User', // Reference to the User model by username
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product', // Reference to the Pro duct model by ID
  },
  count: {
    type: Number,
    required: true,
    default: 1,
  },
});

// Apply the auto-increment plugin to the `cid` field with a unique counter ID
// Ensure that the auto-increment plugin is applied only once
cartSchema.plugin(AutoIncrement, { id: 'cart_cid_unique_counter', inc_field: 'cid' });

// Export the model
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
