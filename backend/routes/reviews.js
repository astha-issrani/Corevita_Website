const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const adminAuth = require('../middleware/adminAuth');

// ── ADMIN ROUTES FIRST (must be before /:slug routes to avoid Express treating "admin" as a slug) ──

router.get('/admin/reviews', adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/admin/reviews/:id', adminAuth, async (req, res) => {
  try {
    const { approved } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { approved }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/admin/reviews/:id', adminAuth, async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── PUBLIC ROUTES (/:slug must come after admin routes) ──

router.get('/:slug/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productSlug: req.params.slug, approved: true })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:slug/reviews', async (req, res) => {
  try {
    const { name, email, title, body, rating, avatarBase64 } = req.body;
    if (!name || !body || !rating) return res.status(400).json({ message: 'Name, review, and rating are required.' });
    if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5.' });

    const review = new Review({
      productSlug: req.params.slug,
      name, email, title, body, rating,
      approved: false,
      avatarUrl: avatarBase64 || '', // store base64 data URL from frontend
    });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully! It will appear after approval.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;