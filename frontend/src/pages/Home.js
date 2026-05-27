import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const testimonials = [
  { name: 'Margaret T.', text: 'I\'ve been taking Bee Pearl for 3 months now and the energy difference is remarkable. No more 3pm crash!', stars: 5 },
  { name: 'David K.', text: 'I was skeptical but after 30 days I genuinely feel sharper and more energized than I have in years.', stars: 5 },
  { name: 'Sandra M.', text: 'My immune system has been so much stronger this winter. Haven\'t gotten sick once since starting CoreVita.', stars: 5 },
  { name: 'Patricia W.', text: 'The mental clarity is what gets me. I feel like the brain fog has completely lifted after 6 weeks.', stars: 5 },
];

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-stars">
              {'★★★★★'} <span>4.8 STARS FROM 400+ REVIEWS</span>
            </div>
            <h1 className="hero-title">
              YOU'RE NOT TIRED,<br />BURNED OUT, OR LAZY<br />
              <span className="hero-title-accent">—<br />YOU'RE<br />UNDERNOURISHED.</span>
            </h1>
            <p className="hero-subtitle">CoreVita restores what your body has been missing.</p>
            <Link to="/products/bee-pearl" className="btn-primary hero-cta">
              Shop Now →
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

      {/* Why Modern Food Isn't Enough */}
      <section className="section why-section">
        <div className="container why-inner">
          <div className="why-img">
            <div className="why-img-placeholder">
              <span>🌱</span>
              <p>Modern Agriculture</p>
            </div>
          </div>
          <div className="why-content">
            <h2>Why Modern Food Isn't Enough</h2>
            <p>Today's food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.</p>
            <div className="stat-item">
              <strong>92%</strong> of people are walking around with critical nutrient gaps that prevent them from feeling their best.
            </div>
            <div className="stat-item">
              <strong>74%</strong> suffer from daily fatigue and mental sludge — clear signs that their body is running on empty reserves.
            </div>
            <p>With 20+ amino acids, minerals, and enzymes, <strong>CoreVita Bee Pearl</strong> is nature's most concentrated multivitamin — and your shortcut to steady energy, faster recovery, and mental clarity in 30 days.</p>
            <Link to="/products/bee-pearl" className="btn-primary" style={{ display: 'inline-block', marginTop: 24 }}>
              TRY COREVITA BEE PEARL →
            </Link>
          </div>
        </div>
      </section>

      {/* Real Results */}
      <section className="section results-section">
        <div className="container">
          <h2 className="section-title">REAL RESULTS IN 30 DAYS</h2>
          <p className="section-sub">We asked our customers how they felt after 4 weeks of daily CoreVita use.</p>
          <div className="results-grid">
            <div className="result-item">
              <div className="result-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="93, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">93%</text>
                </svg>
              </div>
              <p>Reported steady, all-day energy without the afternoon crash.</p>
            </div>
            <div className="result-item">
              <div className="result-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="89, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">89%</text>
                </svg>
              </div>
              <p>Noticed significantly sharper focus and eliminated brain fog.</p>
            </div>
            <div className="result-item">
              <div className="result-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="87, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage">87%</text>
                </svg>
              </div>
              <p>Felt a measurable improvement in overall mood and wellbeing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Stories */}
      <section className="section stories-section">
        <div className="container">
          <h2 className="section-title">Real Stories, Real Results: How CoreVita Is Changing Lives</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <p className="testimonial-name">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container cta-inner">
          <div>
            <h2>Ready to Feel Like Yourself Again?</h2>
            <p>Join 400+ herbalists who have transformed their health with CoreVita Bee Pearl</p>
          </div>
          <Link to="/products/bee-pearl" className="btn-primary cta-btn">
            Get Started Today →
          </Link>
        </div>
      </section>
    </div>
  );
}
