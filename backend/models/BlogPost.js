const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: '' },
    body: { type: String, default: '' },
    coverImage: { type: String, default: '/images/banner-modern-food.svg' },
    author: { type: String, default: 'CoreVita Team' },
    published: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

blogPostSchema.index({ published: 1, publishedAt: -1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
