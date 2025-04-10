const express = require('express');
const router = express.Router();
const Return = require('../models/Returns');

// POST a new return request
router.post('/', async (req, res) => {
  const { orderId, productId, reason, condition } = req.body;

  try {
    const newReturn = new Return({
      orderId,
      productId,
      reason,
      condition
    });

    await newReturn.save();
    res.status(201).json({ message: 'Return request submitted', return: newReturn });
  } catch (err) {
    console.error('Return error:', err.message);
    res.status(500).json({ error: 'Failed to submit return request' });
  }
});

// GET all return requests (optionally filter by orderId or productId)
router.get('/', async (req, res) => {
  const { orderId, productId } = req.query;

  const query = {};
  if (orderId) query.orderId = orderId;
  if (productId) query.productId = productId;

  try {
    const returns = await Return.find(query).populate('orderId productId');
    res.json(returns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve return requests' });
  }
});

module.exports = router;
