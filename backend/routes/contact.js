const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// POST — submit a contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const msg = new ContactMessage({ name, email, subject, message });
    await msg.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — all messages (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH — mark as read (admin only)
router.patch('/:id/read', adminAuth, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE — delete message (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;