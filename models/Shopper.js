const mongoose = require('mongoose');

const ShopperSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // hash it, don't store plaintext
  address: String,
});

module.exports = mongoose.model('Shopper', ShopperSchema);