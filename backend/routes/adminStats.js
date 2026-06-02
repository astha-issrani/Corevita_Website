const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Order = require('../models/Order');
const ContactMessage = require('../models/ContactMessage');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalOrders,
      paidOrders,
      revenueAgg,
      monthRevenueAgg,
      lastMonthRevenueAgg,
      orderStatusBreakdown,
      messagesTotal,
      messagesUnread,
      reviewsTotal,
      reviewsPending,
      activeCoupons,
      monthlyRevenue,
      recentOrders,
      messageSubjects,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ read: false }),
      Review.countDocuments(),
      Review.countDocuments({ approved: false }),
      Coupon.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Order.find({ paymentStatus: 'paid' })
        .sort({ createdAt: -1 })
        .limit(30)
        .select('total createdAt'),
      ContactMessage.aggregate([
        { $group: { _id: '$subject', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;
    const monthRevenue = monthRevenueAgg[0]?.total || 0;
    const monthOrders = monthRevenueAgg[0]?.count || 0;
    const lastMonthRevenue = lastMonthRevenueAgg[0]?.total || 0;
    const lastMonthOrders = lastMonthRevenueAgg[0]?.count || 0;

    const revenueChange = lastMonthRevenue > 0
      ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : monthRevenue > 0 ? 100 : 0;
    const ordersChange = lastMonthOrders > 0
      ? ((monthOrders - lastMonthOrders) / lastMonthOrders) * 100
      : monthOrders > 0 ? 100 : 0;

    const avgOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueChart = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const found = monthlyRevenue.find(
        (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
      );
      revenueChart.push({
        month: monthNames[d.getMonth()],
        revenue: found?.revenue || 0,
        orders: found?.orders || 0,
      });
    }

    const dailyRevenue = [];
    for (let i = 29; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      const dayTotal = recentOrders
        .filter((o) => o.createdAt >= dayStart && o.createdAt <= dayEnd)
        .reduce((sum, o) => sum + (o.total || 0), 0);
      dailyRevenue.push({
        day: dayStart.getDate(),
        value: dayTotal,
      });
    }

    const statusLabels = {
      processing: 'Processing',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };

    const orderStatus = orderStatusBreakdown.map((s) => ({
      status: statusLabels[s._id] || s._id,
      count: s.count,
    }));

    const subjectLabels = {
      order: 'Order Status',
      return: 'Return / Refund',
      product: 'Product Question',
      subscription: 'Subscription',
      other: 'Other',
    };

    const messageBreakdown = messageSubjects.map((s) => ({
      subject: subjectLabels[s._id] || s._id,
      count: s.count,
    }));

    res.json({
      totalRevenue,
      totalOrders,
      paidOrders,
      avgOrderValue,
      monthRevenue,
      monthOrders,
      revenueChange: Math.round(revenueChange * 10) / 10,
      ordersChange: Math.round(ordersChange * 10) / 10,
      messagesTotal,
      messagesUnread,
      reviewsTotal,
      reviewsPending,
      activeCoupons,
      revenueChart,
      dailyRevenue,
      orderStatus,
      messageBreakdown,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
