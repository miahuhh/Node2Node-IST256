const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  reason: String,
  condition: String,
  status: { type: String, default: 'Pending' },
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Return', ReturnSchema);