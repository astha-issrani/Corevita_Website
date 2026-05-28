import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../utils/api';
import './ProductDetail.css';

const PRODUCT_SLIDES = [
  {
    id: 1, label: 'Main',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect x="80" y="60" width="140" height="240" rx="16" fill="white" stroke="#E0E0E0" strokeWidth="2"/>
        <rect x="90" y="30" width="120" height="38" rx="10" fill="#CCCCCC"/>
        <rect x="95" y="34" width="110" height="30" rx="8" fill="#BBBBBB"/>
        <rect x="80" y="120" width="140" height="150" fill="#F5C800"/>
        <ellipse cx="150" cy="175" rx="18" ry="12" fill="#333"/>
        <ellipse cx="150" cy="175" rx="10" ry="11" fill="#F5C800"/>
        <line x1="142" y1="168" x2="142" y2="182" stroke="#333" strokeWidth="1.5"/>
        <line x1="158" y1="168" x2="158" y2="182" stroke="#333" strokeWidth="1.5"/>
        <ellipse cx="140" cy="166" rx="10" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(-30 140 166)"/>
        <ellipse cx="160" cy="166" rx="10" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(30 160 166)"/>
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
    id: 2, label: 'Benefits',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="#FFFBEB" rx="12"/>
        <text x="150" y="40" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="900" fill="#333">WHY CHOOSE</text>
        <text x="150" y="60" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="900" fill="#F5C800">BEE PEARL?</text>
        {[['⚡','All-day energy','No afternoon crash'],['🛡️','Immune defense','Strengthens naturally'],['🧠','Mental clarity','Sharper focus daily'],['💊','100% Natural','30+ capsules per bottle']].map(([icon,title,sub],i)=>(
          <g key={i} transform={`translate(0,${90+i*70})`}>
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
    id: 3, label: 'Mission',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="#1A1A1A" rx="12"/>
        <text x="150" y="50" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#F5C800">COREVITA BEE PEARL</text>
        <text x="150" y="70" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#ccc">MISSION</text>
        <rect x="20" y="85" width="260" height="1" fill="#F5C800" opacity="0.4"/>
        {['✓ 100% Natural Ingredients','✓ No Fillers or Additives','✓ 3rd Party Lab Tested','✓ Bioavailable Formula','✓ Sustainably Sourced','✓ GMP Certified Facility'].map((text,i)=>(
          <text key={i} x="40" y={120+i*36} fontFamily="Arial" fontSize="12" fill="white">{text}</text>
        ))}
        <ellipse cx="150" cy="340" rx="60" ry="18" fill="#F5C800" opacity="0.15"/>
        <text x="150" y="346" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#F5C800">THE ULTIMATE SUPPLEMENT</text>
      </svg>
    )
  },
  {
    id: 4, label: 'Energy',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="#FFFBEB" rx="12"/>
        <text x="150" y="45" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#333">VITALITY &amp; ENERGY</text>
        <text x="150" y="65" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#888">SUPPORT</text>
        {[['Before',30,'#ccc'],['Week 1',55,'#F5C800'],['Week 2',72,'#F5C800'],['Week 4',93,'#E6B800']].map(([label,val,color],i)=>(
          <g key={i} transform={`translate(${30+i*62},90)`}>
            <rect x="8" y={140-val*1.2} width="36" height={val*1.2} fill={color} rx="4"/>
            <text x="26" y={134-val*1.2} textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#333">{val}%</text>
            <text x="26" y="155" textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#666">{label}</text>
          </g>
        ))}
        <text x="150" y="280" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#333" fontWeight="700">93% report all-day energy</text>
        <text x="150" y="298" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#888">after 4 weeks of daily use</text>
        <text x="150" y="340" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#F5C800">★★★★★</text>
        <text x="150" y="362" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#888">4.7/5 from 400+ reviews</text>
      </svg>
    )
  },
  {
    id: 5, label: 'Facts',
    content: (
      <svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300">
        <rect width="300" height="380" fill="white" rx="12" stroke="#E0E0E0" strokeWidth="1.5"/>
        <text x="150" y="30" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#333">Supplement Facts</text>
        <rect x="20" y="38" width="260" height="1.5" fill="#333"/>
        <text x="25" y="58" fontFamily="Arial" fontSize="10" fill="#333">Serving Size: 1 Capsule</text>
        <text x="25" y="74" fontFamily="Arial" fontSize="10" fill="#333">Servings Per Container: 30</text>
        <rect x="20" y="80" width="260" height="1" fill="#ccc"/>
        <text x="25" y="96" fontFamily="Arial" fontSize="9" fontWeight="700" fill="#333">Amount Per Serving</text>
        {[['Bee Bread (Perga)','500mg','*'],['Bee Pollen Extract','200mg','*'],['Royal Jelly','100mg','*'],['Propolis Extract','50mg','*'],['Vitamin C','45mg','50%'],['Zinc','5mg','45%'],['Magnesium','20mg','5%']].map(([name,amt,dv],i)=>(
          <g key={i}>
            <text x="25" y={118+i*24} fontFamily="Arial" fontSize="9" fill="#333">{name}</text>
            <text x="200" y={118+i*24} fontFamily="Arial" fontSize="9" fill="#333" textAnchor="end">{amt}</text>
            <text x="270" y={118+i*24} fontFamily="Arial" fontSize="9" fill="#333" textAnchor="end">{dv}</text>
            <rect x="20" y={122+i*24} width="260" height="0.5" fill="#eee"/>
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
  benefits: ['All day energy without any crashes','Strengthens natural immune defense','Sharper focus & mental clarity','Rich in vitamins for faster recovery'],
  packs: [
    { _id: 'pack1', label: 'Buy 1 + Get 1 FREE', quantity: 2, price: 44.99, originalPrice: 159.98, savingsPercent: 72, badge: '', freeShipping: false },
    { _id: 'pack2', label: 'Buy 2 + Get 2 FREE', quantity: 4, price: 89.98, originalPrice: 319.96, savingsPercent: 72, badge: 'Most Popular', freeShipping: true },
    { _id: 'pack3', label: 'Buy 3 + Get 3 FREE', quantity: 6, price: 134.97, originalPrice: 479.94, savingsPercent: 72, badge: 'Best Deal', freeShipping: true },
  ],
};

const FAQS = [
  { q: 'How does it work?', a: 'Bee Pearl works by flooding your body with 20+ bioavailable amino acids, minerals, and enzymes. Unlike synthetic supplements, bee bread is pre-digested by bees making nutrients instantly absorbable by your cells.' },
  { q: 'What Bee Pearl Helps With', a: 'Vitality & Energy Support, Immune System Function, Nutritional Balance, Stress Resilience, Gentle Detoxification, and overall beauty & wellness.' },
  { q: 'When Will I See Results?', a: 'Most customers feel a difference within 7–14 days. By day 30, the majority notice sustained energy, clearer thinking, and improved mood. Full results develop over 60–90 days of consistent use.' },
  { q: 'Who Can Use It?', a: 'CoreVita Bee Pearl is suitable for adults of all ages. Especially beneficial for those 35+ who feel their vitality declining. Not recommended for those with bee product allergies.' },
];

const STATIC_REVIEWS = [
  { name: 'Michael T.', title: '"Finally ditched my morning coffee"', body: 'I used to need 3 cups of coffee just to function. Since starting CoreVita, I have steady energy all day without the jitters or the afternoon crash. It feels like a cleaner, more natural fuel for my body. Highly recommend!', rating: 5, avatar: '👨🏾' },
  { name: 'Keisha L.', title: '"I haven\'t been sick in months!"', body: 'Everyone in my office has been getting sick lately except me. My immune system feels bulletproof since I added Bee Pearl to my routine. I just feel stronger and more resilient. This is definitely a staple in my morning routine now.', rating: 5, avatar: '👩🏾' },
  { name: 'Kathy R.', title: '"Brain fog is completely gone"', body: 'I was struggling with brain fog and fatigue around 2 PM every day. After about a week of taking this, I feel sharp and focused until the evening. It\'s amazing what actual nutrient-dense superfoods can do for your mind. Love it.', rating: 5, avatar: '👩' },
];

const NUTRIENTS = [
  { name: 'Vitamin B Complex', claim: '5X MORE VITAMIN B12 THAN BEEF LIVER*', color: '#F5C800', icon: '🅱️', vsIcon: '🥩', benefits: ['Boosts energy levels','Combats fatigue','Improves alertness','Supports nerve health'] },
  { name: 'Iron', claim: '3X MORE IRON THAN SPINACH*', color: '#F5C800', icon: '⚗️', vsIcon: '🥬', benefits: ['Prevents anemia','Improves stamina','Supports red blood cells','Enhances oxygen delivery'] },
  { name: 'Vitamin D', claim: '2X MORE VITAMIN D THAN MILK*', color: '#F5C800', icon: '☀️', vsIcon: '🥛', benefits: ['Boosts energy and vitality','Combats tiredness','Supports immune health','Improves mood'] },
  { name: 'Magnesium', claim: '4X MORE MAGNESIUM THAN KALE*', color: '#F5C800', icon: '💎', vsIcon: '🥦', benefits: ['Reduces fatigue','Supports muscle function','Enhances energy production','Relieves muscle soreness'] },
  { name: 'Vitamin C', claim: '7X MORE VITAMIN C THAN ORANGES*', color: '#F5C800', icon: '🍊', vsIcon: '🍋', benefits: ['Strengthens immune system','Reduces inflammation','Protects against stress','Supports healthy skin'] },
  { name: 'Amino Acids', claim: 'MORE PROTEIN THAN EGGS*', color: '#F5C800', icon: '🔬', vsIcon: '🥚', benefits: ['Muscle repair & recovery','Supports neurotransmitters','Boosts metabolic rate','Enhances endurance'] },
];

const SCIENCE_STATS = [
  { pct: '47', label: 'Reported a significant increase in daily energy and focus within just 21 days.' },
  { pct: '33', label: 'Experienced deeper, more restorative REM sleep cycles and woke up recharged.' },
  { pct: '62', label: 'Showed a measurable reduction in systemic inflammation markers and stress.' },
  { pct: '89', label: 'Noticed improved digestion and gut health due to natural bioactive enzymes.' },
];

const ZOOM_SCALE = 2.5;

// --- Star Rating Component ---
function StarRating({ value, onChange, readOnly = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-rating-row" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          className={`star-btn ${(hover||value) >= s ? 'filled' : ''}`}
          onClick={() => !readOnly && onChange && onChange(s)}
          onMouseEnter={() => !readOnly && setHover(s)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >★</span>
      ))}
    </div>
  );
}

// --- Animated Counter ---
function AnimatedStat({ pct, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const target = parseInt(pct);
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 30);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [pct]);
  return (
    <div className="science-stat" ref={ref}>
      <div className="science-pct"><span className="science-num">{count}</span><sup>%</sup></div>
      <p>{label}</p>
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(MOCK_PRODUCT);
  const [selectedPack, setSelectedPack] = useState(MOCK_PRODUCT.packs[0]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [autoRefill, setAutoRefill] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [added, setAdded] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainImgRef = useRef(null);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', title: '', body: '', rating: 0 });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // ✅ FIXED: useCallback so fetchReviews is stable and safe in dep arrays
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/products/${slug || 'bee-pearl'}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {}
  }, [slug, API]);

  // ✅ FIXED: fetchReviews is now in the dep array — no more ESLint warning
  useEffect(() => {
    getProduct(slug || 'bee-pearl')
      .then(({ data }) => { setProduct(data); setSelectedPack(data.packs?.[0] || MOCK_PRODUCT.packs[0]); })
      .catch(() => {});
    fetchReviews();
  }, [slug, fetchReviews]);

  const handleMouseMove = (e) => {
    const rect = mainImgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.min(Math.max(x, 0), 100), y: Math.min(Math.max(y, 0), 100) });
  };

  const handleAddToCart = () => {
    if (!selectedPack) return;
    addToCart({ productId: product._id, packId: selectedPack._id, name: product.name, packLabel: selectedPack.label, price: selectedPack.price, originalPrice: selectedPack.originalPrice, quantity: selectedPack.quantity, packSize: selectedPack.quantity, autoRefill });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.body || reviewForm.rating === 0) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API}/api/products/${slug || 'bee-pearl'}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewForm({ name: '', email: '', title: '', body: '', rating: 0 });
        fetchReviews();
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch {}
    setReviewSubmitting(false);
  };

  const allReviews = [...STATIC_REVIEWS, ...reviews.map(r => ({ ...r, avatar: '👤' }))];
  const avgRating = allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length;

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

      {/* ========== TOP PRODUCT SECTION ========== */}
      <div className="container product-layout">
        {/* Left: Images */}
        <div className="product-images">
          <div className="zoom-wrapper">
            <div
              className={`product-main-img zoom-source ${isZooming ? 'zooming' : ''}`}
              ref={mainImgRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              {isZooming && <div className="zoom-lens" style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%` }} />}
              <div className="product-img-placeholder slide-fade" key={activeSlide}>
                {PRODUCT_SLIDES[activeSlide].content}
              </div>
            </div>
            {isZooming && (
              <div className="zoom-panel">
                <div className="zoom-panel-inner" style={{ transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: `scale(${ZOOM_SCALE})` }}>
                  {PRODUCT_SLIDES[activeSlide].content}
                </div>
              </div>
            )}
          </div>
          <div className="product-thumbnails">
            {PRODUCT_SLIDES.map((slide, i) => (
              <div key={slide.id} className={`thumbnail ${activeSlide === i ? 'active' : ''}`} onClick={() => setActiveSlide(i)}>
                <div className="thumb-inner">{slide.content}</div>
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
          <p className="product-desc">CoreVita Bee Pearl is designed to <strong>restore natural vitality</strong> — the hidden root cause behind faster aging, nutrient depletion, and accelerated weight gain.</p>
          <p className="product-desc">Just one daily dose helps restore balance from within — naturally supporting your <strong>steady energy, recovery, and mental clarity.</strong></p>
          <ul className="benefit-list">
            {product.benefits.map((b, i) => <li key={i}><span className="check">✓</span> {b}</li>)}
          </ul>

          <div className="pack-selector">
            <h3>Choose Your Pack</h3>
            <div className="pack-list">
              {product.packs.map(pack => (
                <div key={pack._id} className={`pack-option ${selectedPack?._id === pack._id ? 'selected' : ''}`} onClick={() => setSelectedPack(pack)}>
                  {pack.badge && <span className="pack-badge">{pack.badge}</span>}
                  <div className="pack-option-row">
                    <div className="pack-radio"><div className={`radio-dot ${selectedPack?._id === pack._id ? 'active' : ''}`} /></div>
                    <div className="pack-label-text">
                      <strong>{pack.label}</strong>
                      <div className="pack-pills-row">
                        {Array.from({ length: pack.quantity }).map((_, i) => {
                          const half = pack.quantity / 2;
                          const isFree = i >= half;
                          return <span key={i} className={`pack-bottle-pill ${isFree ? 'free' : 'paid'}`}>🍯 {isFree ? 'FREE' : `#${i + 1}`}</span>;
                        })}
                      </div>
                      <span className="pack-save">SAVE {pack.savingsPercent}%</span>
                    </div>
                    <div className="pack-price">${pack.price}</div>
                  </div>
                  {pack.freeShipping && <div className="pack-free-ship">🚚 + FREE Shipping</div>}
                </div>
              ))}
            </div>
            <div className={`autorefill-box ${autoRefill ? 'checked' : ''}`} onClick={() => setAutoRefill(!autoRefill)}>
              <div className="autorefill-check">{autoRefill && <span>✓</span>}</div>
              <div><strong>Save More with Automatic Refills!</strong><p>Delivered Monthly</p></div>
            </div>
          </div>

          <button className={`btn-primary add-to-cart-btn ${added ? 'added' : ''}`} onClick={handleAddToCart}>
            {added ? '✓ Added to Cart!' : 'ADD TO CART'}
          </button>
          <div className="trust-badges"><div className="trust-item">🚚 In Stock — Delivery in 5 to 8 business days</div></div>

          <div className="faq-section">
            {FAQS.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {faq.q}<span className={`faq-arrow ${openFaq === i ? 'open' : ''}`}>▼</span>
                </button>
                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== WHY MODERN FOOD SECTION ========== */}
      <div className="below-fold-section">
        <div className="container below-fold-grid">
          <div className="below-fold-text">
            <h2>Why Modern Food Isn't Enough</h2>
            <p>Today's food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.</p>
            <p><strong>92%</strong> of people are walking around with critical nutrient gaps that prevent them from feeling their best.</p>
            <p><strong>74%</strong> suffer from daily fatigue and mental sludge — clear signs that their body is running on empty reserves.</p>
            <p>Your body doesn't need more stimulation; it needs <strong>real nutrition</strong>.</p>
            <h3>Why Your Multivitamin Isn't Enough</h3>
            <p>Most daily supplements are synthetic, made in a lab, and difficult for your body to absorb. CoreVita Bee Pearl is different. It is a <strong>living, pre-digested superfood</strong>.</p>
            <p>Because the bees have already fermented the pollen, the tough outer shell is broken down, making the nutrients <strong>100% bioavailable</strong> so your cells can use them instantly.</p>
            <div className="below-fold-bullets">
              <div className="bf-bullet-group">
                <h4>LIVE ENZYMES &amp; CO-ENZYMES:</h4>
                <ul>
                  <li>Unlike dry tablets, these active compounds support healthy digestion and nutrient uptake.</li>
                  <li>Fuel metabolic processes that convert food into natural, sustained energy.</li>
                </ul>
              </div>
              <div className="bf-bullet-group">
                <h4>COMPLETE B-COMPLEX &amp; VITAMINS:</h4>
                <ul>
                  <li>Packed with natural B-Vitamins (B1, B2, B3, B6, B12) for mental clarity and focus.</li>
                  <li>Rich in Vitamins A, C, and E to fight oxidative stress without the "synthetic crash."</li>
                </ul>
              </div>
              <div className="bf-bullet-group">
                <h4>FREE-FORM AMINO ACIDS:</h4>
                <ul>
                  <li>Contains all 22 amino acids — the raw materials for neurotransmitters, repair, and recovery.</li>
                  <li><strong>Repair damaged tissue</strong> and neutralize inflammation naturally.</li>
                  <li><strong>Support deep sleep</strong>, mental clarity, and sustained stamina.</li>
                </ul>
              </div>
            </div>
            <p className="bf-tagline">Feel revitalized from the inside out. Harness the concentrated power of the hive to reclaim your energy and resilience.</p>
          </div>
          <div className="below-fold-infographic">
            <div className="infographic-card">
              <div className="infographic-center">🍯</div>
              <div className="infographic-labels">
                <div className="infographic-label top">Concentrated Bee Bread to support vitality and overall wellness</div>
                <div className="infographic-label left">B Vitamins &amp; Minerals for natural energy and well-being</div>
                <div className="infographic-label right">Antioxidants for immune support and cellular health</div>
                <div className="infographic-label bottom-left">Amino Acids to aid muscle recovery and tissue repair</div>
                <div className="infographic-label bottom-right">Enzymes for better digestion and nutrient absorption</div>
              </div>
              <div className="infographic-brand">CoreVita</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== NUTRIENT COMPARISON SECTION ========== */}
      <div className="nutrients-section">
        <div className="container">
          <h2 className="section-title">CoreVita Bee Pearl: The Ultimate Nutrient-Rich Superfood for Energy and Vitality</h2>
          <p className="section-subtitle">Here's why we chose Bee Pearl for its powerful energy-boosting nutrients:</p>
          <div className="nutrients-grid">
            {NUTRIENTS.map((n, i) => (
              <div key={i} className="nutrient-card">
                <div className="nutrient-header">{n.name}</div>
                <div className="nutrient-vs-row">
                  <span className="nutrient-icon">{n.icon}</span>
                  <span className="vs-text">VS</span>
                  <span className="nutrient-icon">{n.vsIcon}</span>
                </div>
                <div className="nutrient-claim">{n.claim}</div>
                <ul className="nutrient-benefits">
                  {n.benefits.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="nutrients-cta">
            <button className="btn-primary buy-now-btn" onClick={handleAddToCart}>BUY NOW &amp; SAVE</button>
          </div>
        </div>
      </div>

      {/* ========== SCIENCE SECTION ========== */}
      <div className="science-section">
        <div className="container">
          <h2 className="section-title">The Science Supporting CoreVita</h2>
          <p className="section-subtitle">Results from clinical studies on Bee Bread &amp; Propolis:</p>
          <div className="science-grid">
            {SCIENCE_STATS.map((s, i) => <AnimatedStat key={i} pct={s.pct} label={s.label} />)}
          </div>
          <p className="science-tagline"><strong>With CoreVita Bee Pearl, you're giving your body the nutrients it needs to thrive — backed by real results.</strong></p>
        </div>
      </div>

      {/* ========== REAL STORIES VIDEO SECTION ========== */}
      <div className="stories-section">
        <div className="container">
          <h2 className="section-title">Real Stories, Real Results: How CoreVita Is Changing Lives</h2>
          <div className="stories-grid">
            {[
              { name: 'Sandra M., 62', label: 'Energy & Vitality', videoId: 'dQw4w9WgXcQ' },
              { name: 'James R., 55', label: 'Immune Support', videoId: 'dQw4w9WgXcQ' },
              { name: 'Linda K., 49', label: 'Mental Clarity', videoId: 'dQw4w9WgXcQ' },
              { name: 'Denise W., 58', label: 'Sleep & Recovery', videoId: 'dQw4w9WgXcQ' },
            ].map((s, i) => (
              <div key={i} className="story-video-card">
                <div className="story-video-wrapper">
                  <iframe
                    src={`https://www.youtube.com/embed/${s.videoId}?rel=0&modestbranding=1`}
                    title={s.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="story-video-info">
                  <strong>{s.name}</strong>
                  <span>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========== CUSTOMER REVIEWS SECTION ========== */}
      <div className="reviews-section">
        <div className="container">
          <h2 className="section-title">400+ People Are Already Thriving With<br/>The Healing Power Of Bee Pearl</h2>

          {/* Overall Rating Summary */}
          <div className="rating-summary">
            <div className="rating-big">{avgRating.toFixed(1)}</div>
            <div>
              <StarRating value={Math.round(avgRating)} readOnly size={28} />
              <div className="rating-count">Based on {allReviews.length} reviews</div>
            </div>
          </div>

          {/* Review Cards */}
          <div className="reviews-grid">
            {allReviews.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-avatar">{r.avatar || '👤'}</div>
                <h4 className="review-title">{r.title || `"${r.name}'s Review"`}</h4>
                <StarRating value={r.rating} readOnly size={16} />
                <p className="review-body">{r.body}</p>
                <div className="review-author">
                  <strong>{r.name}</strong> · Loves Our Bee Pearl
                  <span className="verified-badge">✔ Verified Buyer</span>
                </div>
              </div>
            ))}
          </div>

          {/* Review Submission Form */}
          <div className="review-form-wrapper">
            <h3>Share Your Experience</h3>
            <p>Your review helps others discover the power of Bee Pearl.</p>
            {reviewSuccess && (
              <div className="review-success">🎉 Thank you! Your review has been submitted and is pending approval.</div>
            )}
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="review-form-rating">
                <label>Your Rating *</label>
                <StarRating value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} size={32} />
              </div>
              <div className="review-form-row">
                <div className="review-form-field">
                  <label>Your Name *</label>
                  <input type="text" placeholder="e.g. Sarah M." value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="review-form-field">
                  <label>Email (not shown publicly)</label>
                  <input type="email" placeholder="your@email.com" value={reviewForm.email} onChange={e => setReviewForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="review-form-field">
                <label>Review Title</label>
                <input type="text" placeholder='e.g. "Best supplement I have tried!"' value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="review-form-field">
                <label>Your Review *</label>
                <textarea rows={4} placeholder="Tell others about your experience with CoreVita Bee Pearl..." value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))} required />
              </div>
              <button type="submit" className="btn-primary review-submit-btn" disabled={reviewSubmitting || reviewForm.rating === 0}>
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}