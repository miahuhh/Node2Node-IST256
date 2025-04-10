const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  shopperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopper' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }]
});

module.exports = mongoose.model('Cart', CartSchema);