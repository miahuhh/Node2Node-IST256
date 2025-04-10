
const express = require('express');
const router = express.Router();
const Shopper = require('../models/Shopper');

// POST /login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Shopper.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // For now, return basic user info (no JWT/session)
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
