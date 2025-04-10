const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET cart for a specific shopper
router.get('/:shopperId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ shopperId: req.params.shopperId }).populate('items.productId');
    res.json(cart || { items: [] }); // Return empty cart if not found
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// POST new cart or add items
router.post('/', async (req, res) => {
  const { shopperId, items } = req.body;

  try {
    let cart = await Cart.findOne({ shopperId });

    if (cart) {
      // Merge new items with existing cart
      items.forEach(newItem => {
        const existingItem = cart.items.find(i => i.productId.toString() === newItem.productId);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      });
    } else {
      cart = new Cart({ shopperId, items });
    }

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart });
  } catch (err) {
    console.error('Cart error:', err.message);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE a specific item from the cart
router.delete('/:shopperId/:productId', async (req, res) => {
  try {
    const { shopperId, productId } = req.params;
    const cart = await Cart.findOne({ shopperId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
