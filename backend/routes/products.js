const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: update product by slug
router.put('/:slug', adminAuth, async (req, res) => {
  try {
    const allowed = [
      'name', 'tagline', 'description', 'price', 'originalPrice', 'savingsPercent',
      'rating', 'reviewCount', 'stockLeft', 'images', 'benefits', 'packs',
    ];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
