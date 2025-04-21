const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: String,
  address: String,
  carrier: String,
  method: String,
  trackingNumber: String,
  estimatedDelivery: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shipping', shippingSchema);
