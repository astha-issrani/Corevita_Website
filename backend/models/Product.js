const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
  label: String,
  quantity: Number,
  price: Number,
  originalPrice: Number,
  savingsPercent: Number,
  badge: String,
  freeShipping: Boolean,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: String,
  description: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  savingsPercent: Number,
  rating: { type: Number, default: 4.7 },
  reviewCount: { type: Number, default: 400 },
  stockLeft: { type: Number, default: 23 },
  images: [String],
  benefits: [String],
  packs: [packSchema],
  ingredients: String,
  howItWorks: String,
  whatItHelpsWith: [String],
  whenToSeeResults: String,
  whoCanUse: String,
  category: String,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
