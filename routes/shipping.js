const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST shipping info (creates a new order with shipping details)
router.post('/', async (req, res) => {
  const {
    shopperId,
    cart,
    shippingAddress,
    billingAddress,
    paymentMethod,
    totalAmount
  } = req.body;

  try {
    const newOrder = new Order({
      shopperId,
      cart,
      shippingAddress,
      billingAddress,     // Optional if already submitted via billing route
      paymentMethod,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ message: 'Shipping details saved', order: newOrder });
  } catch (err) {
    console.error('Shipping error:', err.message);
    res.status(500).json({ error: 'Failed to store shipping info' });
  }
});

// GET orders by shopper (optional feature)
router.get('/:shopperId', async (req, res) => {
  try {
    const orders = await Order.find({ shopperId: req.params.shopperId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

module.exports = router;