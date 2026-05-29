import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../utils/useContent';
import './Home.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

export default function Home() {
  const { c } = useContent('home');
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/products/bee-pearl/reviews`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const fiveStars = data.filter(r => r.rating === 5).slice(0, 4);
        setLiveReviews(fiveStars);
      })
      .catch(() => {});
  }, []);

  // Fallback static reviews shown only if no live reviews yet
  const staticReviews = [
    { name: 'Margaret T.', body: "I've been taking Bee Pearl for 3 months now and the energy difference is remarkable. No more 3pm crash!", rating: 5 },
    { name: 'David K.',    body: 'I was skeptical but after 30 days I genuinely feel sharper and more energized than I have in years.', rating: 5 },
    { name: 'Sandra M.',   body: "My immune system has been so much stronger this winter. Haven't gotten sick once since starting CoreVita.", rating: 5 },
    { name: 'Patricia W.', body: 'The mental clarity is what gets me. I feel like the brain fog has completely lifted after 6 weeks.', rating: 5 },
  ];

  const testimonials = liveReviews.length >= 2 ? liveReviews : staticReviews;

  // Parse hero title with line breaks
  const heroTitle = c('hero', 'title', "YOU'RE NOT TIRED,\nBURNED OUT, OR LAZY\n—\nYOU'RE\nUNDERNOURISHED.");
  const heroLines = heroTitle.split('\n');
  const accentStart = heroLines.findIndex(l => l === '—');

  return (
    <div className="home-page">
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-stars">
              {c('hero', 'badge', '★★★★★  4.8 STARS FROM 400+ REVIEWS')}
            </div>
            <h1 className="hero-title">
              {heroLines.map((line, i) => (
                <React.Fragment key={i}>
                  {i >= accentStart && accentStart !== -1
                    ? <span className="hero-title-accent">{line}</span>
                    : line}
                  {i < heroLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
            <p className="hero-subtitle">{c('hero', 'subtitle', 'CoreVita restores what your body has been missing.')}</p>
            <Link to="/products/bee-pearl" className="btn-primary hero-cta">
              {c('hero', 'cta', 'Shop Now →')}
            </Link>
          </div>
          <div className="hero-product">
            <div className="hero-product-img">
              <div className="product-bottle-placeholder">
                <div className="bottle-label">
                  <span>CoreVita</span>
                  <strong>BEE PEARL</strong>
                  <small>CONCENTRATED BEE BREAD</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY SECTION ── */}
      <section className="section why-section">
        <div className="container why-inner">
          <div className="why-img">
            <div className="why-img-placeholder">
              <span>🌱</span>
              <p>Modern Agriculture</p>
            </div>
          </div>
          <div className="why-content">
            <h2>{c('why', 'title', "Why Modern Food Isn't Enough")}</h2>
            <p>{c('why', 'body1', '')}</p>
            <div className="stat-item">
              <strong>{c('why', 'stat1_pct', '92%')}</strong> {c('why', 'stat1_text', '')}
            </div>
            <div className="stat-item">
              <strong>{c('why', 'stat2_pct', '74%')}</strong> {c('why', 'stat2_text', '')}
            </div>
            <p>{c('why', 'body2', '')}</p>
            <Link to="/products/bee-pearl" className="btn-primary" style={{ display: 'inline-block', marginTop: 24 }}>
              {c('why', 'cta', 'TRY COREVITA BEE PEARL →')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <section className="section results-section">
        <div className="container">
          <h2 className="section-title">{c('results', 'title', 'REAL RESULTS IN 30 DAYS')}</h2>
          <p className="section-sub">{c('results', 'subtitle', '')}</p>
          <div className="results-grid">
            {[
              { pct: c('results','stat1_pct','93'), text: c('results','stat1_text','') },
              { pct: c('results','stat2_pct','89'), text: c('results','stat2_text','') },
              { pct: c('results','stat3_pct','87'), text: c('results','stat3_text','') },
            ].map((s, i) => (
              <div key={i} className="result-item">
                <div className="result-circle">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="circle" strokeDasharray={`${s.pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <text x="18" y="20.35" className="percentage">{s.pct}%</text>
                  </svg>
                </div>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES / REVIEWS ── */}
      <section className="section stories-section">
        <div className="container">
          <h2 className="section-title">{c('stories', 'title', 'Real Stories, Real Results: How CoreVita Is Changing Lives')}</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                {t.avatarUrl
                  ? <img src={t.avatarUrl} alt={t.name} className="testimonial-avatar-img" />
                  : <div className="testimonial-avatar">{(t.name || '?').charAt(0)}</div>
                }
                <div className="testimonial-stars">{'★'.repeat(t.rating || 5)}</div>
                <p className="testimonial-text">"{t.body || t.text}"</p>
                <p className="testimonial-name">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>{c('cta_banner', 'title', 'Ready to Feel Like Yourself Again?')}</h2>
            <p>{c('cta_banner', 'subtitle', 'Join 400+ herbalists who have transformed their health with CoreVita Bee Pearl')}</p>
          </div>
          <Link to="/products/bee-pearl" className="btn-primary cta-btn">
            {c('cta_banner', 'cta', 'Get Started Today →')}
          </Link>
        </div>
      </section>
    </div>
  );
}