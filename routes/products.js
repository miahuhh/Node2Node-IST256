const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST a new product
router.post('/', async (req, res) => {
  const { name, description, price, image, category, stock } = req.body;

  try {
    const newProduct = new Product({ name, description, price, image, category, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add product' });
  }
});

module.exports = router;