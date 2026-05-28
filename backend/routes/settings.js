const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const adminAuth = require('../middleware/adminAuth');

// GET settings by key (public — frontend needs fonts on load)
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) return res.json({ key: req.params.key, value: null });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT — upsert a setting (admin only)
router.put('/:key', adminAuth, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;