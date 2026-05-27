const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  quantity: Number,
  price: Number,
  packLabel: String,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: String,
  items: [orderItemSchema],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String,
  },
  paymentMethod: { type: String, default: 'card' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'processing'
  },
  trackingNumber: String,
  subtotal: Number,
  discount: { type: Number, default: 0 },       // pack/volume discount
  couponCode: { type: String, default: null },   // applied coupon code
  couponDiscount: { type: Number, default: 0 },  // discount amount from coupon
  shipping: { type: Number, default: 0 },
  total: Number,
  autoRefill: { type: Boolean, default: false },
}, { timestamps: true });

// Generate order number before save
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = 'CV' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);