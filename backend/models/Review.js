const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productSlug: { type: String, required: true, index: true },
  name:        { type: String, required: true, trim: true },
  email:       { type: String, trim: true, lowercase: true },
  title:       { type: String, trim: true },
  body:        { type: String, required: true },
  rating:      { type: Number, required: true, min: 1, max: 5 },
  approved:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);