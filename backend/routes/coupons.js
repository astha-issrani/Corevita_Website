const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const adminAuth = require('../middleware/adminAuth');

// Public: validate a coupon code (customer applies it)
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive) return res.status(400).json({ message: 'This coupon is no longer active' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ message: 'This coupon has expired' });
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    if (orderTotal < coupon.minOrderAmount)
      return res.status(400).json({
        message: `Minimum order of $${coupon.minOrderAmount.toFixed(2)} required for this coupon`
      });

    const discountAmount =
      coupon.discountType === 'percentage'
        ? (orderTotal * coupon.discountValue) / 100
        : Math.min(coupon.discountValue, orderTotal);

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      message: coupon.discountType === 'percentage'
        ? `${coupon.discountValue}% off applied!`
        : `$${coupon.discountValue.toFixed(2)} off applied!`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all coupons
router.get('/', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create coupon
router.post('/', adminAuth, async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Coupon code already exists' });
    res.status(400).json({ message: err.message });
  }
});

// Admin: toggle active status
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete coupon
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;