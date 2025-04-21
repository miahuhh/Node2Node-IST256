const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const returnSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: String,
  productImage: String,
  productPrice: Number,
  reason: String,
  condition: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Return', returnSchema);
