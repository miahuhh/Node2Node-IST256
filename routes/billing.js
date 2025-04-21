const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const Billing = require('../models/Billing');


// POST billing info
router.post("/", auth, async (req, res) => {
  try {
    const billingData = new Billing({
      userId: req.user._id,
      ...req.body
    });

    await billingData.save();
    res.status(201).json({ message: "Billing info saved", billing: billingData });
  } catch (err) {
    res.status(500).json({ error: "Failed to save billing info" });
  }
});


module.exports = router;