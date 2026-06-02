import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProduct } from '../utils/api';
import { useContent } from '../utils/useContent';
import { ScrollReveal } from '../utils/useScrollReveal';
import { renderBoldText } from '../utils/renderBoldText';
import {
  DEFAULT_GALLERY_IMAGES,
  DEFAULT_CAPSULES_IMAGE,
  DEFAULT_TESTIMONIAL_VIDEOS,
  IMG,
  resolveBannerImage,
  resolveMediaImage,
  resolveVideoUrl,
} from '../constants/media';
import './ProductDetail.css';

/** Use fallback when admin/DB value is empty whitespace */
function cv(c, section, field, fallback) {
  const v = c(section, field, fallback);
  const s = String(v ?? '').trim();
  return s || fallback;
}

const PRODUCT_SLIDES = [
  { id:1, label:'Main', content:(<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300"><rect x="80" y="60" width="140" height="240" rx="16" fill="white" stroke="#E0E0E0" strokeWidth="2"/><rect x="90" y="30" width="120" height="38" rx="10" fill="#CCCCCC"/><rect x="95" y="34" width="110" height="30" rx="8" fill="#BBBBBB"/><rect x="80" y="120" width="140" height="150" fill="#F5C800"/><ellipse cx="150" cy="175" rx="18" ry="12" fill="#333"/><ellipse cx="150" cy="175" rx="10" ry="11" fill="#F5C800"/><line x1="142" y1="168" x2="142" y2="182" stroke="#333" strokeWidth="1.5"/><line x1="158" y1="168" x2="158" y2="182" stroke="#333" strokeWidth="1.5"/><ellipse cx="140" cy="166" rx="10" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(-30 140 166)"/><ellipse cx="160" cy="166" rx="10" ry="6" fill="rgba(255,255,255,0.6)" transform="rotate(30 160 166)"/><text x="150" y="130" textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="600" fill="#333">CoreVita</text><text x="150" y="205" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#333">BEE PEARL</text><text x="150" y="220" textAnchor="middle" fontFamily="Arial" fontSize="7" fill="#555">CONCENTRATED BEE BREAD</text><text x="150" y="235" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#666">Traditionally used to support</text><text x="150" y="245" textAnchor="middle" fontFamily="Arial" fontSize="6" fill="#666">vitality and overall wellness</text><text x="150" y="260" textAnchor="middle" fontFamily="Arial" fontSize="7" fill="#555">DIETARY SUPPLEMENT  30 CAPSULES</text></svg>) },
  { id:2, label:'Benefits', content:(<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300"><rect width="300" height="380" fill="#FFFBEB" rx="12"/><text x="150" y="40" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="900" fill="#333">WHY CHOOSE</text><text x="150" y="60" textAnchor="middle" fontFamily="Arial" fontSize="15" fontWeight="900" fill="#F5C800">BEE PEARL?</text>{[['⚡','All-day energy','No afternoon crash'],['🛡️','Immune defense','Strengthens naturally'],['🧠','Mental clarity','Sharper focus daily'],['💊','100% Natural','30+ capsules per bottle']].map(([icon,title,sub],i)=>(<g key={i} transform={`translate(0,${90+i*70})`}><rect x="20" y="0" width="260" height="55" rx="10" fill="white" stroke="#F5C800" strokeWidth="1.5"/><text x="52" y="22" fontFamily="Arial" fontSize="18">{icon}</text><text x="80" y="22" fontFamily="Arial" fontSize="13" fontWeight="700" fill="#333">{title}</text><text x="80" y="40" fontFamily="Arial" fontSize="11" fill="#888">{sub}</text></g>))}</svg>) },
  { id:3, label:'Mission', content:(<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300"><rect width="300" height="380" fill="#1A1A1A" rx="12"/><text x="150" y="50" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#F5C800">COREVITA BEE PEARL</text><text x="150" y="70" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#ccc">MISSION</text><rect x="20" y="85" width="260" height="1" fill="#F5C800" opacity="0.4"/>{['✓ 100% Natural Ingredients','✓ No Fillers or Additives','✓ 3rd Party Lab Tested','✓ Bioavailable Formula','✓ Sustainably Sourced','✓ GMP Certified Facility'].map((text,i)=>(<text key={i} x="40" y={120+i*36} fontFamily="Arial" fontSize="12" fill="white">{text}</text>))}<ellipse cx="150" cy="340" rx="60" ry="18" fill="#F5C800" opacity="0.15"/><text x="150" y="346" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#F5C800">THE ULTIMATE SUPPLEMENT</text></svg>) },
  { id:4, label:'Energy', content:(<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300"><rect width="300" height="380" fill="#FFFBEB" rx="12"/><text x="150" y="45" textAnchor="middle" fontFamily="Arial" fontSize="14" fontWeight="900" fill="#333">VITALITY &amp; ENERGY</text><text x="150" y="65" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#888">SUPPORT</text>{[['Before',30,'#ccc'],['Week 1',55,'#F5C800'],['Week 2',72,'#F5C800'],['Week 4',93,'#E6B800']].map(([label,val,color],i)=>(<g key={i} transform={`translate(${30+i*62},90)`}><rect x="8" y={140-val*1.2} width="36" height={val*1.2} fill={color} rx="4"/><text x="26" y={134-val*1.2} textAnchor="middle" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#333">{val}%</text><text x="26" y="155" textAnchor="middle" fontFamily="Arial" fontSize="9" fill="#666">{label}</text></g>))}<text x="150" y="280" textAnchor="middle" fontFamily="Arial" fontSize="11" fill="#333" fontWeight="700">93% report all-day energy</text><text x="150" y="298" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#888">after 4 weeks of daily use</text><text x="150" y="340" textAnchor="middle" fontFamily="Arial" fontSize="20" fill="#F5C800">★★★★★</text><text x="150" y="362" textAnchor="middle" fontFamily="Arial" fontSize="10" fill="#888">4.7/5 from 400+ reviews</text></svg>) },
  { id:5, label:'Facts', content:(<svg viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" width="240" height="300"><rect width="300" height="380" fill="white" rx="12" stroke="#E0E0E0" strokeWidth="1.5"/><text x="150" y="30" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="900" fill="#333">Supplement Facts</text><rect x="20" y="38" width="260" height="1.5" fill="#333"/><text x="25" y="58" fontFamily="Arial" fontSize="10" fill="#333">Serving Size: 1 Capsule</text><text x="25" y="74" fontFamily="Arial" fontSize="10" fill="#333">Servings Per Container: 30</text><rect x="20" y="80" width="260" height="1" fill="#ccc"/><text x="25" y="96" fontFamily="Arial" fontSize="9" fontWeight="700" fill="#333">Amount Per Serving</text>{[['Bee Bread (Perga)','500mg','*'],['Bee Pollen Extract','200mg','*'],['Royal Jelly','100mg','*'],['Propolis Extract','50mg','*'],['Vitamin C','45mg','50%'],['Zinc','5mg','45%'],['Magnesium','20mg','5%']].map(([name,amt,dv],i)=>(<g key={i}><text x="25" y={118+i*24} fontFamily="Arial" fontSize="9" fill="#333">{name}</text><text x="200" y={118+i*24} fontFamily="Arial" fontSize="9" fill="#333" textAnchor="end">{amt}</text><text x="270" y={118+i*24} fontFamily="Arial" fontSize="9" fill="#333" textAnchor="end">{dv}</text><rect x="20" y={122+i*24} width="260" height="0.5" fill="#eee"/></g>))}<text x="25" y="298" fontFamily="Arial" fontSize="8" fill="#888">* Daily Value not established</text><text x="25" y="318" fontFamily="Arial" fontSize="8" fill="#888">Other Ingredients: Vegetable Cellulose</text><text x="25" y="332" fontFamily="Arial" fontSize="8" fill="#888">(Capsule), Microcrystalline Cellulose.</text><text x="25" y="360" fontFamily="Arial" fontSize="8" fill="#888">No artificial colors, flavors or preservatives.</text></svg>) },
];

const MOCK_PRODUCT = {
  _id:'mock1', name:'CoreVita Bee Pearl Capsules', slug:'bee-pearl', rating:4.7, reviewCount:400,
  price:49.99, originalPrice:79.99, savingsPercent:37, stockLeft:23,
  images: DEFAULT_GALLERY_IMAGES,
  benefits:['All day energy without any crashes','Strengthens natural immune defense','Sharper focus & mental clarity','Rich in vitamins for faster recovery'],
  packs:[
    {_id:'pack1',label:'Buy 1 + Get 1 FREE',quantity:2,price:44.99,originalPrice:159.98,savingsPercent:72,badge:'',freeShipping:false},
    {_id:'pack2',label:'Buy 2 + Get 2 FREE',quantity:4,price:89.98,originalPrice:319.96,savingsPercent:72,badge:'Most Popular',freeShipping:true},
    {_id:'pack3',label:'Buy 3 + Get 3 FREE',quantity:6,price:134.97,originalPrice:479.94,savingsPercent:72,badge:'Best Deal',freeShipping:true},
  ],
};

const STATIC_REVIEWS = [
  {name:'Michael T.',title:'"Finally ditched my morning coffee"',body:"I used to need 3 cups of coffee just to function. Since starting CoreVita, I have steady energy all day without the jitters or the afternoon crash. Highly recommend!",rating:5,avatar:'👨🏾'},
  {name:'Keisha L.',title:'"I haven\'t been sick in months!"',body:"Everyone in my office has been getting sick lately except me. My immune system feels bulletproof since I added Bee Pearl to my routine.",rating:5,avatar:'👩🏾'},
  {name:'Kathy R.',title:'"Brain fog is completely gone"',body:"I was struggling with brain fog and fatigue around 2 PM every day. After about a week of taking this, I feel sharp and focused until the evening.",rating:5,avatar:'👩'},
];

const NUTRIENTS = [
  {name:'Vitamin B Complex',claim:'5X MORE VITAMIN B12 THAN BEEF LIVER*',icon:'🅱️',vsIcon:'🥩',benefits:['Boosts energy levels','Combats fatigue','Improves alertness','Supports nerve health']},
  {name:'Iron',claim:'3X MORE IRON THAN SPINACH*',icon:'⚗️',vsIcon:'🥬',benefits:['Prevents anemia','Improves stamina','Supports red blood cells','Enhances oxygen delivery']},
  {name:'Vitamin D',claim:'2X MORE VITAMIN D THAN MILK*',icon:'☀️',vsIcon:'🥛',benefits:['Boosts energy and vitality','Combats tiredness','Supports immune health','Improves mood']},
  {name:'Magnesium',claim:'4X MORE MAGNESIUM THAN KALE*',icon:'💎',vsIcon:'🥦',benefits:['Reduces fatigue','Supports muscle function','Enhances energy production','Relieves muscle soreness']},
  {name:'Vitamin C',claim:'7X MORE VITAMIN C THAN ORANGES*',icon:'🍊',vsIcon:'🍋',benefits:['Strengthens immune system','Reduces inflammation','Protects against stress','Supports healthy skin']},
  {name:'Amino Acids',claim:'MORE PROTEIN THAN EGGS*',icon:'🔬',vsIcon:'🥚',benefits:['Muscle repair & recovery','Supports neurotransmitters','Boosts metabolic rate','Enhances endurance']},
];

const ZOOM_SCALE = 2.5;

function StarRating({value,onChange,readOnly=false,size=20}){
  const [hover,setHover]=useState(0);
  return(
    <div className="star-rating-row" style={{fontSize:size}}>
      {[1,2,3,4,5].map(s=>(
        <span key={s} className={`star-btn ${(hover||value)>=s?'filled':''}`}
          onClick={()=>!readOnly&&onChange&&onChange(s)}
          onMouseEnter={()=>!readOnly&&setHover(s)}
          onMouseLeave={()=>!readOnly&&setHover(0)}
          style={{cursor:readOnly?'default':'pointer'}}>★</span>
      ))}
    </div>
  );
}

function AnimatedStat({pct,label}){
  const [count,setCount]=useState(0);
  const ref=useRef();
  useEffect(()=>{
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        let start=0;const target=parseInt(pct);const step=Math.ceil(target/40);
        const timer=setInterval(()=>{start+=step;if(start>=target){setCount(target);clearInterval(timer);}else setCount(start);},30);
        observer.disconnect();
      }
    },{threshold:0.3});
    if(ref.current)observer.observe(ref.current);
    return()=>observer.disconnect();
  },[pct]);
  return(
    <div className="science-stat" ref={ref}>
      <div className="science-pct"><span className="science-num">{count}</span><sup>%</sup></div>
      <p>{label}</p>
    </div>
  );
}

// ── Scrollable review carousel ─────────────────────────────────────────────────
function ReviewCarousel({reviews}){
  const scrollRef=useRef();
  const scroll=(dir)=>{ if(scrollRef.current) scrollRef.current.scrollBy({left:dir*320,behavior:'smooth'}); };
  return(
    <div className="review-carousel-wrapper">
      <button className="carousel-arrow left" onClick={()=>scroll(-1)}>‹</button>
      <div className="review-carousel" ref={scrollRef}>
        {reviews.map((r,i)=>(
          <div key={i} className="review-card">
            {r.avatarUrl
              ? <img src={r.avatarUrl} alt={r.name} className="review-avatar-img"/>
              : <div className="review-avatar">{r.avatar||'👤'}</div>
            }
            <h4 className="review-title">{r.title||`"${r.name}'s Review"`}</h4>
            <StarRating value={r.rating} readOnly size={16}/>
            <p className="review-body">{r.body}</p>
            <div className="review-author">
              <strong>{r.name}</strong> · Loves Our Bee Pearl
              <span className="verified-badge">✔ Verified Buyer</span>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow right" onClick={()=>scroll(1)}>›</button>
    </div>
  );
}

function BannerImage({ src, alt, fallback }) {
  const [imgSrc, setImgSrc] = useState(() => resolveBannerImage(src, fallback));
  useEffect(() => {
    setImgSrc(resolveBannerImage(src, fallback));
  }, [src, fallback]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="banner-img"
      onError={() => setImgSrc(fallback)}
    />
  );
}

// ── Banner 1: image LEFT, text RIGHT ──────────────────────────────────────────
function Banner1({c}){
  const imageUrl = cv(c, 'banner1', 'image_url', IMG.bannerModernFood);
  const title    = c('banner1','title',"Why Modern Food Isn't Enough");
  const body     = c('banner1','body',`Today's food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.

92% of people are walking around with critical nutrient gaps that prevent them from feeling their best.

74% suffer from daily fatigue and mental sludge — clear signs that their body is running on empty reserves.

Your body doesn't need more stimulation; it needs repair. Bee Pearl bridges this gap by delivering concentrated, pre-digested nutrients in their raw form — exactly how your body was designed to use them.`);
  const paragraphs = body.split('\n\n').filter(Boolean);

  return(
    <section className="banner-section banner1-section">
      <div className="container banner-grid">
        <ScrollReveal as="div" className="banner-img-wrap banner-img-reveal banner-reveal-from-left">
          <BannerImage
            src={imageUrl}
            alt={c('banner1','image_alt','Modern food and agriculture')}
            fallback={IMG.bannerModernFood}
          />
        </ScrollReveal>
        <ScrollReveal as="div" className="banner-text scroll-reveal-delay">
          <h2>{title}</h2>
          {paragraphs.map((p,i)=><p key={i}>{p}</p>)}
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Banner 2: text LEFT, image RIGHT ──────────────────────────────────────────
function Banner2({c}){
  const imageUrl = cv(c, 'banner2', 'image_url', IMG.bannerBottle);
  const title    = cv(c, 'banner2', 'title', "CoreVita Bee Pearl: Nature's Gold Standard");
  const intro    = cv(c, 'banner2', 'intro', 'Known as "Nature\'s Perfect Food," Bee Bread has been cherished for centuries for its healing power. Its unique enzymatic profile makes it the ultimate tool for restoring vitality.');
  const body     = cv(c, 'banner2', 'body', 'Packed with over 250 bioactive compounds — including rare enzymes and vitamins — CoreVita Bee Pearl replenishes exactly what your body is missing. These nutrients:');
  const bullet1  = cv(c, 'banner2', 'bullet1', 'Fuel mitochondria with pre-digested energy your cells absorb instantly.');
  const bullet2  = cv(c, 'banner2', 'bullet2', 'Repair damaged tissue and neutralize inflammation naturally.');
  const bullet3  = cv(c, 'banner2', 'bullet3', 'Support deep sleep, mental clarity, and sustained stamina.');
  const tagline  = cv(c, 'banner2', 'tagline', 'Feel revitalized from the inside out. Harness the concentrated power of the hive to reclaim your energy and resilience.');

  return(
    <section className="banner-section banner2-section">
      <div className="container banner-grid banner-grid-reverse">
        <ScrollReveal as="div" className="banner-text">
          <h2>{title}</h2>
          {intro && <p>{intro}</p>}
          {body  && <p>{body}</p>}
          {(bullet1||bullet2||bullet3) && (
            <ul className="banner-bullets">
              {bullet1 && <li>{formatBannerBullet(bullet1, 'Fuel mitochondria')}</li>}
              {bullet2 && <li>{formatBannerBullet(bullet2, 'Repair damaged tissue')}</li>}
              {bullet3 && <li>{formatBannerBullet(bullet3, 'Support deep sleep')}</li>}
            </ul>
          )}
          {tagline && <p className="banner-tagline">{tagline}</p>}
        </ScrollReveal>
        <ScrollReveal as="div" className="banner-img-wrap banner-img-wrap--product banner-img-reveal banner-reveal-from-right scroll-reveal-delay">
          <BannerImage
            src={imageUrl}
            alt={c('banner2','image_alt','CoreVita Bee Pearl bottle')}
            fallback={IMG.bannerBottle}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function formatBannerBullet(text, label) {
  const t = String(text).trim();
  if (t.toLowerCase().startsWith(label.toLowerCase())) {
    const rest = t.slice(label.length).replace(/^\s*[—–-]\s*/, '').trim();
    return (
      <>
        <strong>{label}</strong>
        {rest ? <> — {rest}</> : null}
      </>
    );
  }
  return t;
}

const INFO_LABEL_DEFAULTS = {
  top: 'Concentrated Bee Bread to support vitality and overall wellness',
  left: 'B Vitamins & Minerals for natural energy and well-being',
  right: 'Antioxidants for immune support and cellular health',
  bottom_left: 'Amino Acids to aid muscle recovery and tissue repair',
  bottom_right: 'Enzymes for better digestion and nutrient absorption',
};

/* Arrows from bowl → labels — inset so arrowheads are not clipped */
const INFO_CALLOUTS = [
  { key: 'top', pos: 'top', path: 'M 280 172 L 280 88' },
  { key: 'left', pos: 'left', path: 'M 212 248 L 148 248' },
  { key: 'right', pos: 'right', path: 'M 348 248 L 412 248' },
  { key: 'bottom_left', pos: 'bottom-left', path: 'M 224 292 Q 188 348 152 402' },
  { key: 'bottom_right', pos: 'bottom-right', path: 'M 336 292 Q 372 348 408 402' },
];

function InfographicCoreImage({ src, alt, fallback }) {
  const [imgSrc, setImgSrc] = useState(() => resolveMediaImage(src, fallback));
  useEffect(() => {
    setImgSrc(resolveMediaImage(src, fallback));
  }, [src, fallback]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="infographic-core-img infographic-core-img--bowl"
      onError={() => setImgSrc(fallback)}
    />
  );
}

// ── Infographic with visible arrows + editable labels ─────────────────────────
function Infographic({ c }) {
  const imageUrl = cv(c, 'infographic', 'image_url', DEFAULT_CAPSULES_IMAGE);
  const brand = cv(c, 'infographic', 'brand', 'CoreVita');

  return (
    <div className="infographic-diagram">
      {INFO_CALLOUTS.map(({ key, pos }) => (
        <div key={key} className={`infographic-callout infographic-callout--${pos}`}>
          <p>{c('infographic', key, INFO_LABEL_DEFAULTS[key])}</p>
        </div>
      ))}

      <svg className="infographic-arrows-svg" viewBox="-20 -12 600 544" aria-hidden="true" overflow="visible">
        <defs>
          <marker id="info-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 z" fill="#F5C800" />
          </marker>
        </defs>
        {INFO_CALLOUTS.map(({ key, path }) => (
          <path
            key={key}
            d={path}
            fill="none"
            stroke="#F5C800"
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd="url(#info-arrow)"
          />
        ))}
      </svg>

      <div className="infographic-core">
        <InfographicCoreImage
          src={imageUrl}
          alt={c('infographic', 'image_alt', 'CoreVita Bee Pearl capsules')}
          fallback={DEFAULT_CAPSULES_IMAGE}
        />
      </div>
      <div className="infographic-brand">{brand}</div>
    </div>
  );
}

function StoryVideoCard({ src, name, label, fallbackSrc }) {
  const [videoSrc, setVideoSrc] = useState(src);
  useEffect(() => {
    setVideoSrc(src);
  }, [src]);

  if (!src && !fallbackSrc) return null;

  return (
    <div className="story-video-card">
      <div className="story-video-wrapper">
        <video
          key={videoSrc}
          className="story-video-player"
          src={videoSrc}
          controls
          playsInline
          preload="metadata"
          onError={() => {
            if (fallbackSrc && videoSrc !== fallbackSrc) setVideoSrc(fallbackSrc);
          }}
        />
      </div>
      <div className="story-video-info">
        <strong>{name}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function BelowFoldContent({ c }) {
  const groups = [
    {
      title: c('below_fold', 'g1_title', 'LIVE ENZYMES & CO-ENZYMES:'),
      bullets: [
        c('below_fold', 'g1_b1', 'Unlike dry tablets, these active compounds support healthy digestion and nutrient uptake.'),
        c('below_fold', 'g1_b2', 'Fuel metabolic processes that convert food into natural, sustained energy.'),
      ],
    },
    {
      title: c('below_fold', 'g2_title', 'COMPLETE B-COMPLEX & VITAMINS:'),
      bullets: [
        c('below_fold', 'g2_b1', 'Packed with natural B-Vitamins (B1, B2, B3, B6, B12) for mental clarity and focus.'),
        c('below_fold', 'g2_b2', 'Rich in Vitamins A, C, and E to fight oxidative stress without the \'synthetic crash.\''),
      ],
    },
    {
      title: c('below_fold', 'g3_title', 'FREE-FORM AMINO ACIDS:'),
      bullets: [
        c('below_fold', 'g3_b1', 'Contains all 9 essential amino acids necessary for tissue repair and muscle recovery.'),
        c('below_fold', 'g3_b2', 'Supports neurotransmitter health for better mood and cognitive function.'),
        c('below_fold', 'g3_b3', ''),
      ],
    },
  ];

  const body2Default = 'Most daily supplements are synthetic, made in a lab, and difficult for your body to absorb. CoreVita Bee Pearl is different. It is a **living, pre-digested superfood**.';
  const body3Default = 'Because the bees have already fermented the pollen, the tough outer shell is broken down, making the nutrients **100% bioavailable** so your cells can use them instantly.';
  const body4Default = 'Tablets often pass through your system before your body can use them. Bee Pearl delivers enzymes, amino acids, and vitamins in a form your gut recognizes — without the synthetic binders or fillers.';

  const keyPoints = [
    cv(c, 'below_fold', 'mv_p1', 'No synthetic binders, fillers, or lab-made isolates.'),
    cv(c, 'below_fold', 'mv_p2', 'Pre-digested by bees — nutrients your body absorbs, not just passes through.'),
    cv(c, 'below_fold', 'mv_p3', '250+ bioactive compounds working together, not a handful of isolated vitamins.'),
    cv(c, 'below_fold', 'mv_p4', 'Supports energy, immunity, recovery, and mental clarity from one whole-food source.'),
  ].filter(Boolean);

  return (
    <div className="below-fold-text">
      <h3>{cv(c, 'below_fold', 'title2', "Why Your Multivitamin Isn't Enough")}</h3>
      <p>{renderBoldText(cv(c, 'below_fold', 'body2', body2Default))}</p>
      <p>{renderBoldText(cv(c, 'below_fold', 'body3', body3Default))}</p>
      <p>{renderBoldText(cv(c, 'below_fold', 'body4', body4Default))}</p>
      {keyPoints.length > 0 && (
        <ul className="below-fold-key-points">
          {keyPoints.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      )}
      <div className="below-fold-bullets">
        {groups.map((g, i) => (
          <div key={i} className="bf-bullet-group">
            <h4>{g.title}</h4>
            <ul>
              {g.bullets.filter(Boolean).map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail(){
  const {slug}=useParams();
  const {addToCart}=useCart();
  const {c}=useContent('product');

  const [product,setProduct]=useState(MOCK_PRODUCT);
  const [selectedPack,setSelectedPack]=useState(MOCK_PRODUCT.packs[0]);
  const [activeSlide,setActiveSlide]=useState(0);
  const [autoRefill,setAutoRefill]=useState(true);
  const [openFaq,setOpenFaq]=useState(null);
  const [added,setAdded]=useState(false);
  const [isZooming,setIsZooming]=useState(false);
  const [zoomPos,setZoomPos]=useState({x:50,y:50});
  const mainImgRef=useRef(null);
  const packScrollRef=useRef(null);
  const bannerRowRef=useRef(null);

  const [reviews,setReviews]=useState([]);
  const [reviewForm,setReviewForm]=useState({name:'',email:'',title:'',body:'',rating:0});
  const [reviewSubmitting,setReviewSubmitting]=useState(false);
  const [reviewSuccess,setReviewSuccess]=useState(false);
  const [avatarFile,setAvatarFile]=useState(null);
  const [avatarPreview,setAvatarPreview]=useState('');

  const API=(process.env.REACT_APP_API_URL||'http://localhost:5000').replace(/\/api$/,'');

  const fetchReviews=useCallback(async()=>{
    try{
      const res=await fetch(`${API}/api/products/${slug||'bee-pearl'}/reviews`);
      if(res.ok){const data=await res.json();setReviews(data);}
    }catch{}
  },[slug,API]);

  useEffect(()=>{
    getProduct(slug||'bee-pearl').then(({data})=>{setProduct(data);setSelectedPack(data.packs?.[0]||MOCK_PRODUCT.packs[0]);}).catch(()=>{});
    fetchReviews();
  },[slug,fetchReviews]);

  useEffect(()=>{
    const row=bannerRowRef.current;
    if(!row)return;
    const syncBannerOutset=()=>{
      row.style.setProperty('--banner-outset',`${row.getBoundingClientRect().left}px`);
    };
    syncBannerOutset();
    window.addEventListener('resize',syncBannerOutset);
    return()=>window.removeEventListener('resize',syncBannerOutset);
  },[]);

  useEffect(()=>{
    const zone=packScrollRef.current;
    if(!zone)return;
    const onWheel=(e)=>{
      if(window.matchMedia('(max-width: 1024px)').matches)return;
      const{scrollTop,scrollHeight,clientHeight}=zone;
      const atBottom=scrollTop+clientHeight>=scrollHeight-2;
      const atTop=scrollTop<=0;
      if(e.deltaY>0&&atBottom){
        e.preventDefault();
        window.scrollBy({top:e.deltaY,left:0});
      }else if(e.deltaY<0&&atTop){
        e.preventDefault();
        window.scrollBy({top:e.deltaY,left:0});
      }
    };
    zone.addEventListener('wheel',onWheel,{passive:false});
    return()=>zone.removeEventListener('wheel',onWheel);
  },[]);

  const handleMouseMove=(e)=>{
    const rect=mainImgRef.current.getBoundingClientRect();
    const x=((e.clientX-rect.left)/rect.width)*100;
    const y=((e.clientY-rect.top)/rect.height)*100;
    setZoomPos({x:Math.min(Math.max(x,0),100),y:Math.min(Math.max(y,0),100)});
  };

  const handleAddToCart=()=>{
    if(!selectedPack)return;
    addToCart({productId:product._id,packId:selectedPack._id,name:product.name,packLabel:selectedPack.label,price:selectedPack.price,originalPrice:selectedPack.originalPrice,quantity:selectedPack.quantity,packSize:selectedPack.quantity,autoRefill});
    setAdded(true);setTimeout(()=>setAdded(false),2000);
  };

  const handleAvatarChange=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleReviewSubmit=async(e)=>{
    e.preventDefault();
    if(!reviewForm.name||!reviewForm.body||reviewForm.rating===0)return;
    setReviewSubmitting(true);
    try{
      let body={...reviewForm};
      if(avatarFile){
        const b64=await new Promise((res,rej)=>{
          const reader=new FileReader();
          reader.onload=()=>res(reader.result);
          reader.onerror=rej;
          reader.readAsDataURL(avatarFile);
        });
        body.avatarBase64=b64;
      }
      const res=await fetch(`${API}/api/products/${slug||'bee-pearl'}/reviews`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),
      });
      if(res.ok){
        setReviewSuccess(true);
        setReviewForm({name:'',email:'',title:'',body:'',rating:0});
        setAvatarFile(null);setAvatarPreview('');
        fetchReviews();
        setTimeout(()=>setReviewSuccess(false),4000);
      }
    }catch{}
    setReviewSubmitting(false);
  };

  const faqs=[1,2,3,4].map(n=>({
    q:c('faq',`q${n}`,['How does it work?','What Bee Pearl Helps With','When Will I See Results?','Who Can Use It?'][n-1]),
    a:c('faq',`a${n}`,''),
  })).filter(f=>f.q&&f.a);

  const scienceStats=[1,2,3,4].map(n=>({
    pct:c('science',`stat${n}_pct`,['47','33','62','89'][n-1]),
    label:c('science',`stat${n}_text`,''),
  }));

  const videos=[0,1,2,3].map((i)=>({
    src:resolveVideoUrl(c,i),
    fallback:DEFAULT_TESTIMONIAL_VIDEOS[i]?.url,
    name:c('videos',`video${i+1}_name`,DEFAULT_TESTIMONIAL_VIDEOS[i]?.name||`Customer ${i+1}`),
    label:c('videos',`video${i+1}_label`,DEFAULT_TESTIMONIAL_VIDEOS[i]?.label||''),
  }));

  const allReviews=[...STATIC_REVIEWS,...reviews.map(r=>({...r,avatar:r.avatarUrl?null:'👤'}))];
  const avgRating=allReviews.reduce((a,r)=>a+r.rating,0)/allReviews.length;

  const galleryUrls=useMemo(()=>{
    const urls=(product.images||[]).filter(u=>u&&String(u).trim());
    return urls.length>0?urls:DEFAULT_GALLERY_IMAGES;
  },[product.images]);
  const hasGallery=galleryUrls.length>0;
  const displayTitle=c('hero','title','')||product.name;
  const mainImageUrl=hasGallery?galleryUrls[Math.min(activeSlide,galleryUrls.length-1)]:null;

  return(
    <div className="product-page">
      {/* Sticky bottom bar */}
      <div className="sticky-bottom-bar">
        <div className="sticky-product-info">
          <div className="sticky-img-box">
            {mainImageUrl
              ? <img src={mainImageUrl} alt="" className="sticky-product-photo" />
              : <span>🐝</span>}
          </div>
          <div>
            <p>{displayTitle}</p>
            <span className="sticky-price">${product.price}</span>
            <span className="sticky-original">${product.originalPrice}</span>
            <span className="badge badge-green">SAVE {product.savingsPercent}%</span>
          </div>
        </div>
        <button className="btn-primary" onClick={handleAddToCart}>Add to cart</button>
      </div>

      {/* ── PRODUCT HERO ── */}
      <div className="container product-hero-wrapper">
        <div className="product-images">
          <div className="zoom-wrapper">
            <div className={`product-main-img zoom-source ${isZooming?'zooming':''}`} ref={mainImgRef}
              onMouseEnter={()=>setIsZooming(true)} onMouseLeave={()=>setIsZooming(false)} onMouseMove={handleMouseMove}>
              {isZooming&&<div className="zoom-lens" style={{left:`${zoomPos.x}%`,top:`${zoomPos.y}%`}}/>}
              {hasGallery ? (
                <img
                  key={activeSlide}
                  src={mainImageUrl}
                  alt={displayTitle}
                  className="product-photo slide-fade"
                />
              ) : (
                <div className="product-img-placeholder slide-fade" key={activeSlide}>
                  {PRODUCT_SLIDES[activeSlide].content}
                </div>
              )}
            </div>
            {isZooming&&(
              <div className="zoom-panel">
                <div
                  className="zoom-panel-inner"
                  style={{
                    transformOrigin:`${zoomPos.x}% ${zoomPos.y}%`,
                    transform:`scale(${ZOOM_SCALE})`,
                    backgroundImage:hasGallery?`url(${mainImageUrl})`:'none',
                    backgroundSize:'cover',
                    backgroundPosition:`${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                >
                  {!hasGallery&&PRODUCT_SLIDES[activeSlide].content}
                </div>
              </div>
            )}
          </div>
          <div className="product-thumbnails">
            {hasGallery
              ? galleryUrls.map((url,i)=>(
                <div key={i} className={`thumbnail ${activeSlide===i?'active':''}`} onClick={()=>setActiveSlide(i)}>
                  <div className="thumb-inner"><img src={url} alt="" className="thumb-photo" /></div>
                </div>
              ))
              : PRODUCT_SLIDES.map((slide,i)=>(
                <div key={slide.id} className={`thumbnail ${activeSlide===i?'active':''}`} onClick={()=>setActiveSlide(i)}>
                  <div className="thumb-inner">{slide.content}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-rating"><span className="stars">★★★★★</span><span className="rating-text">{product.rating}/5 Loved by {product.reviewCount}+ herbalists</span></div>
          <h1 className="product-title">{displayTitle}</h1>
          <div className="product-pricing">
            <span className="current-price">${product.price}</span>
            <span className="original-price">${product.originalPrice}</span>
            <span className="stock-badge">⚡ Only {product.stockLeft} Left</span>
          </div>
          <p className="product-desc">{renderBoldText(c('hero','desc1','CoreVita Bee Pearl is designed to **restore natural vitality** — the hidden root cause behind faster aging, nutrient depletion, and accelerated weight gain.'))}</p>
          <p className="product-desc">{renderBoldText(c('hero','desc2','Just one daily dose helps restore balance from within — naturally supporting your **steady energy, recovery, and mental clarity**.'))}</p>
          <ul className="benefit-list">{product.benefits.map((b,i)=><li key={i}><span className="check">✓</span> {b}</li>)}</ul>

          <div className="pack-scroll-zone" ref={packScrollRef}>
            <div className="pack-selector">
              <h3>Choose Your Pack</h3>
              <div className="pack-list">
                {product.packs.map(pack=>(
                  <div key={pack._id} className={`pack-option ${selectedPack?._id===pack._id?'selected':''}`} onClick={()=>setSelectedPack(pack)}>
                    {pack.badge&&<span className="pack-badge">{pack.badge}</span>}
                    <div className="pack-option-row">
                      <div className="pack-radio"><div className={`radio-dot ${selectedPack?._id===pack._id?'active':''}`}/></div>
                      <div className="pack-label-text">
                        <strong>{pack.label}</strong>
                        <span className="pack-save">SAVE {pack.savingsPercent}%</span>
                      </div>
                      <div className="pack-pricing">
                        <span className="pack-price">${pack.price}</span>
                        {pack.originalPrice > 0 && (
                          <span className="pack-original-price">${pack.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    {pack.freeShipping&&<div className="pack-free-ship">+ FREE Shipping</div>}
                  </div>
                ))}
              </div>
              <div className={`autorefill-box ${autoRefill?'checked':''}`} onClick={()=>setAutoRefill(!autoRefill)}>
                <div className="autorefill-check">{autoRefill&&<span>✓</span>}</div>
                <div><strong>Save More with Automatic Refills!</strong><p>Delivered Monthly</p></div>
              </div>
            </div>
          </div>

          <button className={`btn-primary add-to-cart-btn ${added?'added':''}`} onClick={handleAddToCart}>
            {added?'✓ Added to Cart!':'ADD TO CART'}
          </button>
          <div className="trust-badges"><div className="trust-item">{c('hero','trust','🚚 In Stock — Delivery in 5 to 8 business days')}</div></div>

          <div className="faq-section">
            {faqs.map((faq,i)=>(
              <div key={i} className="faq-item">
                <button className="faq-trigger" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  {faq.q}<span className={`faq-arrow ${openFaq===i?'open':''}`}>▼</span>
                </button>
                {openFaq===i&&<div className="faq-answer">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="product-banner-row" ref={bannerRowRef}>
          <Banner1 c={c}/>
        </div>
      </div>

      {/* ── BANNER 2: Nature's Gold Standard (text left, image right) ── */}
      <Banner2 c={c}/>

      {/* ── BELOW FOLD: bullet points + editable infographic ── */}
      <section className="below-fold-section">
        <div className="container below-fold-grid">
          <ScrollReveal as="div" className="below-fold-col below-fold-col--text">
            <BelowFoldContent c={c} />
          </ScrollReveal>
          <ScrollReveal as="div" className="below-fold-col below-fold-col--diagram scroll-reveal-delay">
            <div className="below-fold-infographic">
              <Infographic c={c} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── NUTRIENTS ── */}
      <ScrollReveal className="nutrients-section">
        <div className="container">
          <h2 className="section-title">{c('nutrients','title','CoreVita Bee Pearl: The Ultimate Nutrient-Rich Superfood for Energy and Vitality')}</h2>
          <p className="section-subtitle">{c('nutrients','subtitle',"Here's why we chose Bee Pearl for its powerful energy-boosting nutrients:")}</p>
          <div className="nutrients-grid">
            {NUTRIENTS.map((n,i)=>(
              <div key={i} className="nutrient-card">
                <div className="nutrient-header">{n.name}</div>
                <div className="nutrient-vs-row"><span className="nutrient-icon">{n.icon}</span><span className="vs-text">VS</span><span className="nutrient-icon">{n.vsIcon}</span></div>
                <div className="nutrient-claim">{n.claim}</div>
                <ul className="nutrient-benefits">{n.benefits.map((b,j)=><li key={j}>{b}</li>)}</ul>
              </div>
            ))}
          </div>
          <div className="nutrients-cta"><button className="btn-primary buy-now-btn" onClick={handleAddToCart}>BUY NOW &amp; SAVE</button></div>
        </div>
      </ScrollReveal>

      {/* ── SCIENCE ── */}
      <ScrollReveal className="science-section">
        <div className="container">
          <h2 className="section-title">{c('science','title','The Science Supporting CoreVita')}</h2>
          <p className="section-subtitle">{c('science','subtitle','Results from clinical studies on Bee Bread & Propolis:')}</p>
          <div className="science-grid">
            {scienceStats.map((s,i)=><AnimatedStat key={i} pct={s.pct} label={s.label}/>)}
          </div>
          <p className="science-tagline"><strong>{c('science','tagline',"With CoreVita Bee Pearl, you're giving your body the nutrients it needs to thrive.")}</strong></p>
        </div>
      </ScrollReveal>

      {/* ── VIDEOS ── */}
      <div className="stories-section">
        <div className="container">
          <h2 className="section-title">{c('videos','title','Real Stories, Real Results: How CoreVita Is Changing Lives')}</h2>
          <div className="stories-grid">
            {videos.map((s,i)=>(
              <StoryVideoCard key={i} src={s.src} fallbackSrc={s.fallback} name={s.name} label={s.label} />
            ))}
          </div>
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div className="reviews-section">
        <div className="container">
          <h2 className="section-title">{c('reviews','title','400+ People Are Already Thriving With The Healing Power Of Bee Pearl')}</h2>
          <div className="rating-summary">
            <div className="rating-big">{avgRating.toFixed(1)}</div>
            <div>
              <StarRating value={Math.round(avgRating)} readOnly size={28}/>
              <div className="rating-count">Based on {allReviews.length} reviews</div>
            </div>
          </div>

          <ReviewCarousel reviews={allReviews}/>

          <div className="review-form-wrapper">
            <h3>Share Your Experience</h3>
            <p>Your review helps others discover the power of Bee Pearl.</p>
            {reviewSuccess&&<div className="review-success">🎉 Thank you! Your review has been submitted and is pending approval.</div>}
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <div className="review-form-rating">
                <label>Your Rating *</label>
                <StarRating value={reviewForm.rating} onChange={v=>setReviewForm(f=>({...f,rating:v}))} size={32}/>
              </div>

              <div className="review-form-field">
                <label>Profile Photo (optional)</label>
                <div className="avatar-upload-row">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="preview" className="avatar-preview"/>
                    : <div className="avatar-preview-placeholder">👤</div>
                  }
                  <label className="avatar-upload-btn">
                    {avatarPreview?'Change Photo':'Upload Photo'}
                    <input type="file" accept="image/*" onChange={handleAvatarChange} style={{display:'none'}}/>
                  </label>
                  {avatarPreview&&<button type="button" className="avatar-remove-btn" onClick={()=>{setAvatarFile(null);setAvatarPreview('');}}>✕ Remove</button>}
                </div>
              </div>

              <div className="review-form-row">
                <div className="review-form-field">
                  <label>Your Name *</label>
                  <input type="text" placeholder="e.g. Sarah M." value={reviewForm.name} onChange={e=>setReviewForm(f=>({...f,name:e.target.value}))} required/>
                </div>
                <div className="review-form-field">
                  <label>Email (not shown publicly)</label>
                  <input type="email" placeholder="your@email.com" value={reviewForm.email} onChange={e=>setReviewForm(f=>({...f,email:e.target.value}))}/>
                </div>
              </div>
              <div className="review-form-field">
                <label>Review Title</label>
                <input type="text" placeholder='e.g. "Best supplement I have tried!"' value={reviewForm.title} onChange={e=>setReviewForm(f=>({...f,title:e.target.value}))}/>
              </div>
              <div className="review-form-field">
                <label>Your Review *</label>
                <textarea rows={4} placeholder="Tell others about your experience with CoreVita Bee Pearl..." value={reviewForm.body} onChange={e=>setReviewForm(f=>({...f,body:e.target.value}))} required/>
              </div>
              <button type="submit" className="btn-primary review-submit-btn" disabled={reviewSubmitting||reviewForm.rating===0}>
                {reviewSubmitting?'Submitting...':'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}