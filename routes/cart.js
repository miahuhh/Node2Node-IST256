
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Products');

// GET cart with populated product data
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST add product to cart using _id
router.post('/', async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [{ productId: product._id, quantity }] });
    } else {
      const item = cart.items.find(i => i.productId.toString() === product._id.toString());
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ productId: product._id, quantity });
      }
    }

    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error('Cart error:', err.message);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

module.exports = router;
