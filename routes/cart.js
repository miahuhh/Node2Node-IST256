
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Products');

// GET cart (for simplicity, shared cart in this version)
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// POST single item to cart
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({ items: [{ productId: product._id, quantity }] });
    } else {
      const existingItem = cart.items.find(i => i.productId.toString() === product._id.toString());
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId: product._id, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error('Cart error:', err.message);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

module.exports = router;
