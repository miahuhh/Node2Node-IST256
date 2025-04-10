const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  description: String,
  category: String,
  unit: String,
  price: Number,
  weight: String
});

module.exports = mongoose.model('Product', ProductSchema);