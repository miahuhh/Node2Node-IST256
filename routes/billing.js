const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST billing info
router.post('/', async (req, res) => {
  const {
    shopperId,
    cart,
    billingAddress,
    shippingAddress,
    paymentMethod,
    totalAmount
  } = req.body;

  try {
    const newOrder = new Order({
      shopperId,
      cart,
      billingAddress,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Billing error:', err.message);
    res.status(500).json({ error: 'Failed to store billing information' });
  }
});

module.exports = router;