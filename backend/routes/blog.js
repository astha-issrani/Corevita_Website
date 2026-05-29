const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const adminAuth = require('../middleware/adminAuth');

function slugify(title) {
  return String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Admin: all posts (before /:slug) */
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ updatedAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/admin', adminAuth, async (req, res) => {
  try {
    const { title, slug, excerpt, body, coverImage, author, published, publishedAt } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const finalSlug = slugify(slug || title);
    const existing = await BlogPost.findOne({ slug: finalSlug });
    if (existing) return res.status(400).json({ message: 'Slug already exists' });
    const post = await BlogPost.create({
      title,
      slug: finalSlug,
      excerpt: excerpt || '',
      body: body || '',
      coverImage: coverImage || '/images/banner-modern-food.svg',
      author: author || 'CoreVita Team',
      published: published !== false,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const { title, slug, excerpt, body, coverImage, author, published, publishedAt } = req.body;
    if (title != null) post.title = title;
    if (excerpt != null) post.excerpt = excerpt;
    if (body != null) post.body = body;
    if (coverImage != null) post.coverImage = coverImage;
    if (author != null) post.author = author;
    if (published != null) post.published = published;
    if (publishedAt != null) post.publishedAt = new Date(publishedAt);
    if (slug != null && slug.trim()) {
      const finalSlug = slugify(slug);
      const clash = await BlogPost.findOne({ slug: finalSlug, _id: { $ne: post._id } });
      if (clash) return res.status(400).json({ message: 'Slug already in use' });
      post.slug = finalSlug;
    }
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** Public: paginated published posts */
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 6));
    const filter = { published: true };
    const total = await BlogPost.countDocuments(filter);
    const posts = await BlogPost.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('title slug excerpt coverImage author publishedAt createdAt');
    res.json({
      posts,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/** Public: single post by slug */
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug, published: true });
    if (!post) return res.status(404).json({ message: 'Article not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
