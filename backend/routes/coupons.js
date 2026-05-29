const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const adminAuth = require('../middleware/adminAuth');

// Public: validate a coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon)           return res.status(404).json({ message: 'Invalid coupon code' });
    if (!coupon.isActive)  return res.status(400).json({ message: 'This coupon is no longer active' });
    if (coupon.expiresAt && new Date() > coupon.expiresAt)
                           return res.status(400).json({ message: 'This coupon has expired' });
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
                           return res.status(400).json({ message: 'This coupon has reached its usage limit' });
    if (orderTotal !== undefined && orderTotal < coupon.minOrderAmount)
      return res.status(400).json({ message: `Minimum order of $${coupon.minOrderAmount.toFixed(2)} required` });

    const discountAmount = coupon.discountType === 'percentage'
      ? parseFloat(((orderTotal || 0) * coupon.discountValue / 100).toFixed(2))
      : parseFloat(Math.min(coupon.discountValue, orderTotal || coupon.discountValue).toFixed(2));

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      message: coupon.discountType === 'percentage'
        ? `${coupon.discountValue}% off applied!`
        : `$${coupon.discountValue.toFixed(2)} off applied!`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: redeem (increment usedCount when order is placed)
router.post('/redeem', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code required' });
    await Coupon.findOneAndUpdate(
      { code: code.toUpperCase().trim() },
      { $inc: { usedCount: 1 } }
    );
    res.json({ message: 'Redeemed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all
router.get('/', adminAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: create
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

// Admin: toggle
router.patch('/:id/toggle', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Not found' });
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;