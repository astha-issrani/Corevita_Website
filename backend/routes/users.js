const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const user = new User({ email, password, firstName, lastName });
    await user.save();
    const token = jwt.sign({ id: user._id, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, isAdmin: false } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login (users + admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin credentials from env
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@corevita.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const token = jwt.sign({ id: 'admin', isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: 'admin', email: adminEmail, firstName: 'Admin', isAdmin: true } });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, isAdmin: false }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, firstName: user.firstName, isAdmin: false } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.user.isAdmin) return res.json({ id: 'admin', email: process.env.ADMIN_EMAIL || 'admin@corevita.com', firstName: 'Admin', isAdmin: true });
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  res.json({ message: 'Subscribed successfully!' });
});

module.exports = router;