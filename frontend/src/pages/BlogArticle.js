import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { renderRichText } from '../utils/renderRichText';
import { resolveUploadUrl } from '../utils/uploadUrl';
import './Blog.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

export default function BlogArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API}/blog/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setPost)
      .catch(() => setError('Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-page">
        <p className="blog-loading">Loading article…</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-page">
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <h1>Article not found</h1>
          <p style={{ margin: '16px 0 24px', color: '#666' }}>This post may have been removed or unpublished.</p>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="blog-article-page">
      <header className="blog-article-hero scroll-reveal">
        <div className="container">
          <Link to="/blog" className="blog-back">← All articles</Link>
          <h1 className="blog-article-title">{post.title}</h1>
          <p className="blog-article-meta">
            {date} · {post.author || 'CoreVita Team'}
          </p>
        </div>
      </header>

      {post.coverImage && (
        <div className="blog-article-cover scroll-reveal scroll-reveal-scale">
          <img src={resolveUploadUrl(post.coverImage)} alt="" />
        </div>
      )}

      <div className="blog-article-content scroll-reveal scroll-reveal-delay">
        {renderRichText(post.body, { className: 'blog-article-rich' })}
      </div>

      <div className="container">
        <div className="blog-cta-box">
          <h3>Ready to feel the difference?</h3>
          <p style={{ marginBottom: 16, color: '#555' }}>
            Try CoreVita Bee Pearl — nature&apos;s concentrated superfood for steady energy and vitality.
          </p>
          <Link to="/products/bee-pearl" className="btn-primary">
            Shop CoreVita Bee Pearl
          </Link>
        </div>
      </div>
    </article>
  );
}
