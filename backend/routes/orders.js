const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Create order (guest or logged-in)
router.post('/', async (req, res) => {
  try {
    const orderData = { ...req.body };

    // If a coupon was used, increment its usedCount
    if (orderData.couponCode) {
      await Coupon.findOneAndUpdate(
        { code: orderData.couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Track order by order number + email
router.post('/track', async (req, res) => {
  try {
    const { orderNumber, email, trackingNumber } = req.body;
    let order;
    if (trackingNumber) {
      order = await Order.findOne({ trackingNumber });
    } else {
      order = await Order.findOne({
        orderNumber,
        $or: [{ guestEmail: email }, { 'shippingAddress.email': email }]
      });
    }
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

// Admin: get ALL orders with full customer info
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') query.orderStatus = status;

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { guestEmail: { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.city': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update order status
router.patch('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (trackingNumber) update.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single order (public — for order success page)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;