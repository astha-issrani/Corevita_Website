const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productSlug: { type: String, required: true },
  name:        { type: String, required: true },
  email:       { type: String, default: '' },
  title:       { type: String, default: '' },
  body:        { type: String, required: true },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  approved:    { type: Boolean, default: false },
  avatarUrl:   { type: String, default: '' }, // base64 data URL or hosted image URL
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);