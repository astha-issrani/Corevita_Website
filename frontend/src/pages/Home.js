import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../utils/useContent';
import './Home.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';
const BOTTLE_IMG = `${process.env.PUBLIC_URL || ''}/images/bee-pearl-bottle.svg`;

function renderBoldText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function Home() {
  const { c } = useContent('home');
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/products/bee-pearl/reviews`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setLiveReviews(data.filter(r => r.rating === 5).slice(0, 4)))
      .catch(() => {});
  }, []);

  const staticReviews = [
    { name: 'Margaret T.', body: "I've been taking Bee Pearl for 3 months now and the energy difference is remarkable. No more 3pm crash!", rating: 5 },
    { name: 'David K.', body: 'I was skeptical but after 30 days I genuinely feel sharper and more energized than I have in years.', rating: 5 },
    { name: 'Sandra M.', body: "My immune system has been so much stronger this winter. Haven't gotten sick once since starting CoreVita.", rating: 5 },
    { name: 'Patricia W.', body: 'The mental clarity is what gets me. I feel like the brain fog has completely lifted after 6 weeks.', rating: 5 },
  ];
  const testimonials = liveReviews.length >= 2 ? liveReviews : staticReviews;

  const heroTitle = c('hero', 'title', "YOU'RE NOT TIRED,\nBURNED OUT, OR LAZY\n—\nYOU'RE\nUNDERNOURISHED.");
  const heroLines = heroTitle.split('\n');
  const dashIndex = heroLines.findIndex(l => l.trim() === '—' || l.trim() === '-');
  const accentIndex = heroLines.findIndex(l => l.toUpperCase().includes('UNDERNOURISHED'));

  const stats = [
    { pct: c('results', 'stat1_pct', '93'), text: c('results', 'stat1_text', 'Reported steady, all-day energy without the afternoon crash.') },
    { pct: c('results', 'stat2_pct', '89'), text: c('results', 'stat2_text', 'Noticed significantly sharper focus and reduced brain fog.') },
    { pct: c('results', 'stat3_pct', '95'), text: c('results', 'stat3_text', 'Felt a measurable improvement in overall mood and daily vitality.') },
  ];

  return (
    <div className="home-page">
      {/* Hero — headline + bottle */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-stars">
              <span className="hero-stars-icons">★★★★★</span>
              <span className="hero-stars-text">
                {c('hero', 'badge', '4.8 STARS FROM 400+ REVIEWS').replace(/^★+\s*/, '')}
              </span>
            </div>
            <h1 className="hero-title">
              {heroLines.map((line, i) => {
                const isDash = line.trim() === '—' || line.trim() === '-';
                const isAccent = i === accentIndex || line.toUpperCase().includes('UNDERNOURISHED');
                if (isDash) {
                  return <span key={i} className="hero-rule" aria-hidden="true" />;
                }
                return (
                  <React.Fragment key={i}>
                    {isAccent ? (
                      <span className="hero-accent-line">
                        {line.replace(/\.$/, '')}
                        <span className="hero-yellow-underline" />
                      </span>
                    ) : (
                      <span className="hero-line">{line}</span>
                    )}
                    {i < heroLines.length - 1 && !isDash && <br />}
                  </React.Fragment>
                );
              })}
            </h1>
            <p className="hero-tagline">{c('hero', 'subtitle', 'CoreVita restores what your body has been missing.')}</p>
          </div>
          <div className="hero-product">
            <img src={BOTTLE_IMG} alt="CoreVita Bee Pearl supplement bottle" className="hero-bottle-img" />
          </div>
        </div>
      </section>

      {/* Pitch — undernourished + CTA */}
      <section className="hero-pitch-section">
        <div className="container hero-pitch-inner">
          <h2 className="pitch-headline">
            YOU&apos;RE <span className="pitch-accent">UNDERNOURISHED<span className="hero-yellow-underline" /></span>.
          </h2>
          <p className="pitch-subtitle">{c('hero', 'subtitle', 'CoreVita restores what your body has been missing.')}</p>
          <p className="pitch-body">
            {renderBoldText(c('hero', 'body', "With 20+ amino acids, minerals, and enzymes, **CoreVita Bee Pearl** is nature's most concentrated multivitamin — and your shortcut to steady energy, faster recovery, and mental clarity in 30 days."))}
          </p>
          <Link to="/products/bee-pearl" className="btn-pill hero-cta-pill">
            {c('hero', 'cta', 'TRY COREVITA BEE PEARL >')}
          </Link>
        </div>
      </section>

      {/* Results */}
      <section className="results-section">
        <div className="container results-layout">
          <div className="results-intro">
            <h2>{c('results', 'title', 'REAL RESULTS IN 30 DAYS')}</h2>
            <p>{c('results', 'subtitle', 'We asked our customers how they felt after 4 weeks of daily CoreVita use.')}</p>
          </div>
          <div className="results-stats">
            <h3>{c('results', 'heading', 'Here is what they said:')}</h3>
            <ul className="results-list">
              {stats.map((s, i) => (
                <li key={i} className="result-row">
                  <div className="result-circle" aria-hidden="true">
                    <svg viewBox="0 0 36 36" className="circular-chart">
                      <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="circle" strokeDasharray={`${s.pct}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <text x="18" y="20.35" className="percentage">{s.pct}%</text>
                    </svg>
                  </div>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="stories-section">
        <div className="container">
          <h2 className="stories-title">{c('stories', 'title', 'Real Stories, Real Results: How CoreVita Is Changing Lives')}</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="testimonial-avatar-img" />
                ) : (
                  <div className="testimonial-avatar">{(t.name || '?').charAt(0)}</div>
                )}
                <div className="testimonial-stars">{'★'.repeat(t.rating || 5)}</div>
                <p className="testimonial-text">&ldquo;{t.body || t.text}&rdquo;</p>
                <p className="testimonial-name">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>{c('cta_banner', 'title', 'Ready to Feel Like Yourself Again?')}</h2>
            <p>{c('cta_banner', 'subtitle', 'Join 400+ customers who have transformed their health with CoreVita Bee Pearl')}</p>
          </div>
          <Link to="/products/bee-pearl" className="btn-pill cta-btn">
            {c('cta_banner', 'cta', 'Get Started Today →')}
          </Link>
        </div>
      </section>
    </div>
  );
}
