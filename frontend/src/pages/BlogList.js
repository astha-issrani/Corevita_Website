import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

export default function BlogList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({ posts: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/blog?page=${currentPage}&limit=6`)
      .then((r) => r.json())
      .then((json) => setData({
        posts: json.posts || [],
        pages: json.pages || 1,
        total: json.total || 0,
      }))
      .catch(() => setData({ posts: [], pages: 1, total: 0 }))
      .finally(() => setLoading(false));
  }, [currentPage]);

  const goTo = (p) => {
    if (p < 1 || p > data.pages) return;
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const page = currentPage;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="blog-page">
      <header className="blog-hero">
        <div className="container">
          <h1>CoreVita Blog</h1>
          <p>Wellness insights on bee bread, natural energy, and living well in a nutrient-depleted world.</p>
        </div>
      </header>

      <section className="blog-list-section">
        <div className="container">
          {loading ? (
            <p className="blog-loading">Loading articles…</p>
          ) : data.posts.length === 0 ? (
            <p className="blog-empty">No articles yet. Check back soon.</p>
          ) : (
            <>
              <div className="blog-grid">
                {data.posts.map((post) => (
                  <article key={post._id} className="blog-card">
                    <Link to={`/blog/${post.slug}`} className="blog-card-img-wrap">
                      <img
                        src={post.coverImage || '/images/banner-modern-food.svg'}
                        alt=""
                        className="blog-card-img"
                      />
                    </Link>
                    <div className="blog-card-body">
                      <p className="blog-card-meta">
                        {formatDate(post.publishedAt)} · {post.author || 'CoreVita Team'}
                      </p>
                      <h2 className="blog-card-title">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <Link to={`/blog/${post.slug}`} className="blog-card-link">
                        Read article →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {data.pages > 1 && (
                <nav className="blog-pagination" aria-label="Blog pages">
                  <button
                    type="button"
                    className="blog-page-btn"
                    disabled={page <= 1}
                    onClick={() => goTo(page - 1)}
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`blog-page-btn ${n === page ? 'active' : ''}`}
                      onClick={() => goTo(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="blog-page-btn"
                    disabled={page >= data.pages}
                    onClick={() => goTo(page + 1)}
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
