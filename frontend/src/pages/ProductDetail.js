import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../utils/api';
import './ProductDetail.css';

// SVG-based product images rendered inline — no external files needed
const PRODUCT_SLIDES = [
  {
    id: 1,
    label: 'Main',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        {/* Bottle body */}
        <rect x="80" y="60" width="140" height="240" rx="16" fill="white" stroke="#E0E0E0" strokeWidth="2"/>
        {/* Cap */}
        <rect x="90" y="30" width="120" height="38" rx="10" fill="#CCCCCC"/>
        <rect x="95" y="34" width="110" height="30" rx="8" fill="#BBBBBB"/>
        {/* Yellow label */}
        <rect x="80" y="120" width="140" height="150" fill="#F5C800"/>
        {/* Bee icon */}
        <ellipse cx="150" cy="175" rx="18" ry="12" fill="#333"/>
        <ellipse cx="150" cy="175" rx="10" ry="11" fill="#F5C800"/>
        <line x1="142" y1="168" x2="142" y2="182" stroke="#333" strokeWidth="1.5"/>
        <line x1="158" y1="168" x2="158" y2="182" stroke="#333" strokeWidth="1.5"/>
        <ellipse cx="140" cy="166" rx="10" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(-30 140 166)"/>
        <ellipse cx="160" cy="166" rx="10" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(30 160 166)"/>
        {/* Text */}
        <text x="150" y="130" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="600" fill="#333">CoreVita</text>
        <text x="150" y="205" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#333">BEE PEARL</text>
        <text x="150" y="220" textAnchor="middle" fontFamily="Arial" fontSize="7" fill="#555">CONCENTRATED BEE BREAD</text>
        <text x="150" y="235" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#666">Traditionally used to support</text>
        <text x="150" y="245" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#666">vitality and overall wellness</text>
        <text x="150" y="260" textAnchor="middle" fontFamily="Arial" fontSize="7" fill="#555">DIETARY SUPPLEMENT  30 CAPSULES</text>
      </svg>
    )
  },
  {
    id: 2,
    label: 'Benefits',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="#FFFBEB" rx="12"/>
        <text x="150" y="40" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="900" fill="#333">WHY CHOOSE</text>
        <text x="150" y="60" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="900" fill="#F5C800">BEE PEARL?</text>
        {[
          ['⚡', 'All-day energy', 'No afternoon crash'],
          ['🛡️', 'Immune defense', 'Strengthens naturally'],
          ['🧠', 'Mental clarity', 'Sharper focus daily'],
          ['💊', '100% Natural', '30+ capsules per bottle'],
        ].map(([icon, title, sub], i) => (
          <g key={i} transform={`translate(0, ${90 + i * 70})`}>
            <rect x="20" y="0" width="260" height="55" rx="10" fill="white" stroke="#F5C800" strokeWidth="1.5"/>
            <text x="52" y="22" fontFamily="Arial" fontSize="18">{icon}</text>
            <text x="80" y="22" fontFamily="Arial" fontSize="13" fontWeight="700" fill="#333">{title}</text>
            <text x="80" y="40" fontFamily="Arial" fontSize="11" fill="#888">{sub}</text>
          </g>
        ))}
      </svg>
    )
  },
  {
    id: 3,
    label: 'Mission',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="#1A1A1A" rx="12"/>
        <text x="150" y="50" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#F5C800">COREVITA BEE PEARL</text>
        <text x="150" y="70" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#ccc">MISSION</text>
        <rect x="20" y="85" width="260" height="1" fill="#F5C800" opacity="0.4"/>
        {[
          '✓ 100% Natural Ingredients',
          '✓ No Fillers or Additives',
          '✓ 3rd Party Lab Tested',
          '✓ Bioavailable Formula',
          '✓ Sustainably Sourced',
          '✓ GMP Certified Facility',
        ].map((text, i) => (
          <text key={i} x="40" y={120 + i * 36} fontFamily="Arial" fontSize="12" fill="white">{text}</text>
        ))}
        <ellipse cx="150" cy="340" rx="60" ry="18" fill="#F5C800" opacity="0.15"/>
        <text x="150" y="346" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#F5C800">THE ULTIMATE SUPPLEMENT</text>
      </svg>
    )
  },
  {
    id: 4,
    label: 'Energy',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="#FFFBEB" rx="12"/>
        <text x="150" y="45" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#333">VITALITY &amp; ENERGY</text>
        <text x="150" y="65" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#888">SUPPORT</text>
        {/* Energy bar chart */}
        {[['Before', 30, '#ccc'], ['Week 1', 55, '#F5C800'], ['Week 2', 72, '#F5C800'], ['Week 4', 93, '#E6B800']].map(([label, val, color], i) => (
          <g key={i} transform={`translate(${30 + i * 62}, 90)`}>
            <rect x="8" y={140 - val * 1.2} width="36" height={val * 1.2} fill={color} rx="4"/>
            <text x="26" y={134 - val * 1.2} textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#333">{val}%</text>
            <text x="26" y="155" textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#666">{label}</text>
          </g>
        ))}
        <text x="150" y="280" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#333" fontWeight="700">93% report all-day energy</text>
        <text x="150" y="298" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#888">after 4 weeks of daily use</text>
        {/* Stars */}
        <text x="150" y="340" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#F5C800">★★★★★</text>
        <text x="150" y="362" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#888">4.7/5 from 400+ reviews</text>
      </svg>
    )
  },
  {
    id: 5,
    label: 'Facts',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="white" rx="12" stroke="#E0E0E0" strokeWidth="1.5"/>
        <text x="150" y="30" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#333">Supplement Facts</text>
        <rect x="20" y="38" width="260" height="1.5" fill="#333"/>
        <text x="25" y="58" fontFamily="Arial" fontSize="10" fill="#333">Serving Size: 1 Capsule</text>
        <text x="25" y="74" fontFamily="Arial" fontSize="10" fill="#333">Servings Per Container: 30</text>
        <rect x="20" y="80" width="260" height="1" fill="#ccc"/>
        <text x="25" y="96" fontFamily="Arial" fontSize="9" fontWeight="700" fill="#333">Amount Per Serving</text>
        {[
          ['Bee Bread (Perga)', '500mg', '*'],
          ['Bee Pollen Extract', '200mg', '*'],
          ['Royal Jelly', '100mg', '*'],
          ['Propolis Extract', '50mg', '*'],
          ['Vitamin C', '45mg', '50%'],
          ['Zinc', '5mg', '45%'],
          ['Magnesium', '20mg', '5%'],
        ].map(([name, amt, dv], i) => (
          <g key={i}>
            <text x="25" y={118 + i * 24} fontFamily="Arial" fontSize="9" fill="#333">{name}</text>
            <text x="200" y={118 + i * 24} fontFamily="Arial" fontSize="9" fill="#333" textAnchor="end">{amt}</text>
            <text x="270" y={118 + i * 24} fontFamily="Arial" fontSize="9" fill="#333" textAnchor="end">{dv}</text>
            <rect x="20" y={122 + i * 24} width="260" height="0.5" fill="#eee"/>
          </g>
        ))}
        <text x="25" y="298" fontFamily="Arial" fontSize="8" fill="#888">* Daily Value not established</text>
        <text x="25" y="318" fontFamily="Arial" fontSize="8" fill="#888">Other Ingredients: Vegetable Cellulose</text>
        <text x="25" y="332" fontFamily="Arial" fontSize="8" fill="#888">(Capsule), Microcrystalline Cellulose.</text>
        <text x="25" y="360" fontFamily="Arial" fontSize="8" fill="#888">No artificial colors, flavors or preservatives.</text>
      </svg>
    )
  },
];

const MOCK_PRODUCT = {
  _id: 'mock1',
  name: 'CoreVita Bee Pearl Capsules',
  slug: 'bee-pearl',
  rating: 4.7,
  reviewCount: 400,
  price: 49.99,
  originalPrice: 79.99,
  savingsPercent: 37,
  stockLeft: 23,
  benefits: [
    'All day energy without any crashes',
    'Strengthens natural immune defense',
    'Sharper focus & mental clarity',
    'Rich in vitamins for faster recovery',
  ],
  packs: [
    { _id: 'pack1', label: 'Buy 1 + Get 1 FREE', quantity: 2, price: 44.99, originalPrice: 159.98, savingsPercent: 72, badge: '', freeShipping: false },
    { _id: 'pack2', label: 'Buy 2 + Get 2 FREE', quantity: 4, price: 89.98, originalPrice: 319.96, savingsPercent: 72, badge: 'Most Popular', freeShipping: true },
    { _id: 'pack3', label: 'Buy 3 + Get 3 FREE', quantity: 6, price: 134.97, originalPrice: 479.94, savingsPercent: 72, badge: 'Best Deal', freeShipping: true },
  ],
  howItWorks: 'Bee Pearl works by flooding your body with 20+ bioavailable amino acids, minerals, and enzymes. Unlike synthetic supplements, bee bread is pre-digested by bees making nutrients instantly absorbable by your cells.',
  whenToSeeResults: 'Most customers feel a difference within 7–14 days. By day 30, the majority notice sustained energy, clearer thinking, and improved mood.',
  whoCanUse: 'Suitable for adults of all ages. Especially beneficial for those 35+ who feel their vitality declining. Not recommended for those with bee product allergies.',
};

const FAQS = [
  { q: 'How does it work?', a: 'Bee Pearl works by flooding your body with 20+ bioavailable amino acids, minerals, and enzymes. Unlike synthetic supplements, bee bread is pre-digested by bees making nutrients instantly absorbable by your cells.' },
  { q: 'What Bee Pearl Helps With', a: 'Vitality & Energy Support, Immune System Function, Nutritional Balance, Stress Resilience, Gentle Detoxification, and overall beauty & wellness.' },
  { q: 'When Will I See Results?', a: 'Most customers feel a difference within 7–14 days. By day 30, the majority notice sustained energy, clearer thinking, and improved mood. Full results develop over 60–90 days of consistent use.' },
  { q: 'Who Can Use It?', a: 'CoreVita Bee Pearl is suitable for adults of all ages. Especially beneficial for those 35+ who feel their vitality declining. Not recommended for those with bee product allergies.' },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(MOCK_PRODUCT);
  const [selectedPack, setSelectedPack] = useState(MOCK_PRODUCT.packs[0]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoRefill, setAutoRefill] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProduct(slug || 'bee-pearl')
      .then(({ data }) => { setProduct(data); setSelectedPack(data.packs[0]); })
      .catch(() => {});
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedPack) return;
    addToCart({
      productId: product._id,
      packId: selectedPack._id,
      name: product.name,
      packLabel: selectedPack.label,
      price: selectedPack.price,
      originalPrice: selectedPack.originalPrice,
      quantity: 1,
      autoRefill,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-page">
      {/* Sticky bottom bar (mobile) */}
      <div className="sticky-bottom-bar">
        <div className="sticky-product-info">
          <div className="sticky-img-box">🐝</div>
          <div>
            <p>{product.name}</p>
            <span className="sticky-price">${product.price}</span>
            <span className="sticky-original">${product.originalPrice}</span>
            <span className="badge badge-green">SAVE {product.savingsPercent}%</span>
          </div>
        </div>
        <button className="btn-primary" onClick={handleAddToCart}>Add to cart</button>
      </div>

      <div className="container product-layout">
        {/* Left: Images */}
        <div className="product-images">
          <div className="product-main-img">
            <div className="product-img-placeholder slide-fade" key={activeSlide}>
              {PRODUCT_SLIDES[activeSlide].content}
            </div>
          </div>
          <div className="product-thumbnails">
            {PRODUCT_SLIDES.map((slide, i) => (
              <div
                key={slide.id}
                className={`thumbnail ${activeSlide === i ? 'active' : ''}`}
                onClick={() => setActiveSlide(i)}
              >
                <div className="thumb-inner">
                  {slide.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-info">
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-text">{product.rating}/5 Loved by {product.reviewCount}+ herbalists</span>
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="product-pricing">
            <span className="current-price">${product.price}</span>
            <span className="original-price">${product.originalPrice}</span>
            <span className="stock-badge">⚡ Only {product.stockLeft} Left</span>
          </div>

          <p className="product-desc">
            CoreVita Bee Pearl is designed to <strong>restore natural vitality</strong> — the hidden root cause behind faster aging, nutrient depletion, and accelerated weight gain.
          </p>
          <p className="product-desc">
            Just one daily dose helps restore balance from within — naturally supporting your <strong>steady energy, recovery, and mental clarity.</strong>
          </p>

          <ul className="benefit-list">
            {product.benefits.map((b, i) => (
              <li key={i}><span className="check">✓</span> {b}</li>
            ))}
          </ul>

          {/* Pack Selector */}
          <div className="pack-selector">
            <h3>Choose Your Pack</h3>
            <div className="pack-list">
              {product.packs.map(pack => (
                <div
                  key={pack._id}
                  className={`pack-option ${selectedPack?._id === pack._id ? 'selected' : ''}`}
                  onClick={() => setSelectedPack(pack)}
                >
                  {pack.badge && <span className="pack-badge">{pack.badge}</span>}
                  <div className="pack-option-row">
                    <div className="pack-radio">
                      <div className={`radio-dot ${selectedPack?._id === pack._id ? 'active' : ''}`} />
                    </div>
                    <div className="pack-label-text">
                      <strong>{pack.label}</strong>
                      <span className="pack-save">SAVE {pack.savingsPercent}%</span>
                    </div>
                    <div className="pack-price">${pack.price}</div>
                  </div>
                  {pack.freeShipping && (
                    <div className="pack-free-ship">🚚 + FREE Shipping</div>
                  )}
                </div>
              ))}
            </div>

            {/* Auto Refill */}
            <div className={`autorefill-box ${autoRefill ? 'checked' : ''}`} onClick={() => setAutoRefill(!autoRefill)}>
              <div className="autorefill-check">
                {autoRefill && <span>✓</span>}
              </div>
              <div>
                <strong>Save More with Automatic Refills!</strong>
                <p>Delivered Monthly</p>
              </div>
            </div>
          </div>

          <button
            className={`btn-primary add-to-cart-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✓ Added to Cart!' : 'ADD TO CART'}
          </button>

          <div className="trust-badges">
            <div className="trust-item">🚚 In Stock — Delivery in 5 to 8 business days</div>
          </div>

          {/* FAQ Accordions */}
          <div className="faq-section">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}
                  <span className={`faq-arrow ${openFaq === i ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}