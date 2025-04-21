const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: String,
  address: String,
  cardNumber: String,
  expiry: String,
  cvv: String,
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Billing', billingSchema);
