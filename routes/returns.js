const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const auth = require('../middleware/auth');

router.post("/", auth, async (req, res) => {
  try {
    const newReturn = new Return({
      userId: req.user._id,
      ...req.body
    });

    await newReturn.save();
    res.status(201).json({ message: "Return submitted", return: newReturn });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit return" });
  }
});

module.exports = router;
