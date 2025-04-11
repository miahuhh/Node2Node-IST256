const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const Shipping = require('../models/Shipping');

// POST shipping info (creates a new order with shipping details)
router.post("/", auth, async (req, res) => {
  try {
    const shipping = new Shipping({
      userId: req.user._id,
      ...req.body
    });

    await shipping.save();
    res.status(201).json({ message: "Shipping info saved", shipping });
  } catch (err) {
    res.status(500).json({ error: "Failed to save shipping info" });
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