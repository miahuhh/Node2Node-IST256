const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  shopperId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopper' },
  cart: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  shippingAddress: String,
  billingAddress: String,
  paymentMethod: String,
  totalAmount: Number,
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);