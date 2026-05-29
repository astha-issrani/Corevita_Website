const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const adminAuth = require('../middleware/adminAuth');

const DEFAULTS = [
  // ── HOME PAGE ──────────────────────────────────────────────────────────────
  { page:'home', section:'hero',    field:'badge',      value:'4.8 STARS FROM 400+ REVIEWS' },
  { page:'home', section:'hero',    field:'title',      value:"YOU'RE NOT TIRED,\nBURNED OUT, OR LAZY\n—\nYOU'RE\nUNDERNOURISHED." },
  { page:'home', section:'hero',    field:'subtitle',   value:'CoreVita restores what your body has been missing.' },
  { page:'home', section:'hero',    field:'body',       value:'With 20+ amino acids, minerals, and enzymes, **CoreVita Bee Pearl** is nature\'s most concentrated multivitamin — and your shortcut to steady energy, faster recovery, and mental clarity in 30 days.' },
  { page:'home', section:'hero',    field:'cta',        value:'TRY COREVITA BEE PEARL >' },

  { page:'home', section:'why',     field:'title',      value:"Why Modern Food Isn't Enough" },
  { page:'home', section:'why',     field:'body1',      value:'Today\'s food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.' },
  { page:'home', section:'why',     field:'stat1_pct',  value:'92%' },
  { page:'home', section:'why',     field:'stat1_text', value:'of people are walking around with critical nutrient gaps that prevent them from feeling their best.' },
  { page:'home', section:'why',     field:'stat2_pct',  value:'74%' },
  { page:'home', section:'why',     field:'stat2_text', value:'suffer from daily fatigue and mental sludge — clear signs that their body is running on empty reserves.' },
  { page:'home', section:'why',     field:'body2',      value:'With 20+ amino acids, minerals, and enzymes, CoreVita Bee Pearl is nature\'s most concentrated multivitamin — and your shortcut to steady energy, faster recovery, and mental clarity in 30 days.' },
  { page:'home', section:'why',     field:'cta',        value:'TRY COREVITA BEE PEARL →' },

  { page:'home', section:'results', field:'title',      value:'REAL RESULTS IN 30 DAYS' },
  { page:'home', section:'results', field:'subtitle',   value:'We asked our customers how they felt after 4 weeks of daily CoreVita use.' },
  { page:'home', section:'results', field:'stat1_pct',  value:'93' },
  { page:'home', section:'results', field:'stat1_text', value:'Reported steady, all-day energy without the afternoon crash.' },
  { page:'home', section:'results', field:'stat2_pct',  value:'89' },
  { page:'home', section:'results', field:'stat2_text', value:'Noticed significantly sharper focus and reduced brain fog.' },
  { page:'home', section:'results', field:'stat3_pct',  value:'95' },
  { page:'home', section:'results', field:'stat3_text', value:'Felt a measurable improvement in overall mood and daily vitality.' },
  { page:'home', section:'results', field:'heading',    value:'Here is what they said:' },

  { page:'home', section:'stories', field:'title',      value:'Real Stories, Real Results: How CoreVita Is Changing Lives' },

  { page:'home', section:'cta_banner', field:'title',   value:'Ready to Feel Like Yourself Again?' },
  { page:'home', section:'cta_banner', field:'subtitle',value:'Join 400+ herbalists who have transformed their health with CoreVita Bee Pearl' },
  { page:'home', section:'cta_banner', field:'cta',     value:'Get Started Today →' },

  // ── PRODUCT DETAIL PAGE ────────────────────────────────────────────────────
  { page:'product', section:'hero', field:'title',  value:'CoreVita Bee Pearl Capsules' },
  { page:'product', section:'hero', field:'desc1',  value:'CoreVita Bee Pearl is designed to restore natural vitality — the hidden root cause behind faster aging, nutrient depletion, and accelerated weight gain.' },
  { page:'product', section:'hero', field:'desc2',  value:'Just one daily dose helps restore balance from within — naturally supporting your steady energy, recovery, and mental clarity.' },
  { page:'product', section:'hero', field:'trust',  value:'🚚 In Stock — Delivery in 5 to 8 business days' },

  // ── BANNER 1: Why Modern Food Isn't Enough (image LEFT, text RIGHT) ──
  { page:'product', section:'banner1', field:'image_url', value:'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80' },
  { page:'product', section:'banner1', field:'image_alt', value:'Modern agriculture and pesticide use' },
  { page:'product', section:'banner1', field:'title',     value:"Why Modern Food Isn't Enough" },
  { page:'product', section:'banner1', field:'body',      value:'Today\'s food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.\n\n92% of people are walking around with critical nutrient gaps that prevent them from feeling their best.\n\n74% suffer from daily fatigue and mental sludge — clear signs that their body is running on empty reserves.\n\nYour body doesn\'t need more stimulation; it needs repair. Bee Pearl bridges this gap by delivering concentrated, pre-digested nutrients in their raw form — exactly how your body was designed to use them.' },

  // ── BANNER 2: Nature's Gold Standard (text LEFT, image RIGHT) ──
  { page:'product', section:'banner2', field:'image_url', value:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&q=80' },
  { page:'product', section:'banner2', field:'image_alt', value:'CoreVita Bee Pearl product bottle' },
  { page:'product', section:'banner2', field:'title',     value:"CoreVita Bee Pearl: Nature's Gold Standard" },
  { page:'product', section:'banner2', field:'intro',     value:'Known as "Nature\'s Perfect Food," Bee Bread has been cherished for centuries for its healing power. Its unique enzymatic profile makes it the ultimate tool for restoring vitality.' },
  { page:'product', section:'banner2', field:'body',      value:'Packed with over 250 bioactive compounds — including rare enzymes and vitamins — CoreVita Bee Pearl replenishes exactly what your body is missing. These nutrients:' },
  { page:'product', section:'banner2', field:'bullet1',   value:'pre-digested energy your cells absorb instantly.' },
  { page:'product', section:'banner2', field:'bullet2',   value:'damaged tissue and neutralize inflammation naturally.' },
  { page:'product', section:'banner2', field:'bullet3',   value:'deep sleep, mental clarity, and sustained stamina.' },
  { page:'product', section:'banner2', field:'tagline',   value:'Feel revitalized from the inside out. Harness the concentrated power of the hive to reclaim your energy and resilience.' },

  // ── INFOGRAPHIC / CAPSULES SECTION ──
  { page:'product', section:'infographic', field:'image_url',    value:'https://images.unsplash.com/photo-1584308664944-24d5adfdbeae?w=700&q=85' },
  { page:'product', section:'infographic', field:'image_alt',    value:'CoreVita Bee Pearl capsules' },
  { page:'product', section:'infographic', field:'center_emoji', value:'🍯' },
  { page:'product', section:'infographic', field:'top',          value:'Concentrated Bee Bread to support vitality and overall wellness' },
  { page:'product', section:'infographic', field:'left',         value:'B Vitamins & Minerals for natural energy and well-being' },
  { page:'product', section:'infographic', field:'right',        value:'Antioxidants for immune support and cellular health' },
  { page:'product', section:'infographic', field:'bottom_left',  value:'Amino Acids to aid muscle recovery and tissue repair' },
  { page:'product', section:'infographic', field:'bottom_right', value:'Enzymes for better digestion and nutrient absorption' },
  { page:'product', section:'infographic', field:'brand',        value:'CoreVita' },

  { page:'product', section:'below_fold', field:'title1',  value:"Why Modern Food Isn't Enough" },
  { page:'product', section:'below_fold', field:'body1',   value:'Today\'s food supply is broken. "Empty" calories and nutrient-dead soil mean we have to eat twice as much just to get half the nutrition our grandparents did.' },
  { page:'product', section:'below_fold', field:'stat1',   value:'92% of people are walking around with critical nutrient gaps that prevent them from feeling their best.' },
  { page:'product', section:'below_fold', field:'stat2',   value:'74% suffer from daily fatigue and mental sludge — clear signs that their body is running on empty reserves.' },
  { page:'product', section:'below_fold', field:'title2',  value:"Why Your Multivitamin Isn't Enough" },
  { page:'product', section:'below_fold', field:'body2',   value:'Most daily supplements are synthetic, made in a lab, and difficult for your body to absorb. CoreVita Bee Pearl is different. It is a living, pre-digested superfood.' },
  { page:'product', section:'below_fold', field:'body3',   value:'Because it is 100% bioavailable, your body absorbs the nutrients instantly — no fillers, no wasted effort.' },
  { page:'product', section:'below_fold', field:'g1_title', value:'LIVE ENZYMES & CO-ENZYMES:' },
  { page:'product', section:'below_fold', field:'g1_b1', value:'Unlike dry tablets, these active compounds support healthy digestion and nutrient uptake.' },
  { page:'product', section:'below_fold', field:'g1_b2', value:'Fuel metabolic processes that convert food into natural, sustained energy.' },
  { page:'product', section:'below_fold', field:'g2_title', value:'COMPLETE B-COMPLEX & VITAMINS:' },
  { page:'product', section:'below_fold', field:'g2_b1', value:'Packed with natural B-Vitamins (B1, B2, B3, B6, B12) for mental clarity and focus.' },
  { page:'product', section:'below_fold', field:'g2_b2', value:'Rich in Vitamins A, C, and E to fight oxidative stress.' },
  { page:'product', section:'below_fold', field:'g3_title', value:'FREE-FORM AMINO ACIDS:' },
  { page:'product', section:'below_fold', field:'g3_b1', value:'Contains all 22 amino acids — the raw materials for neurotransmitters, repair, and recovery.' },
  { page:'product', section:'below_fold', field:'g3_b2', value:'Repair damaged tissue and neutralize inflammation naturally.' },
  { page:'product', section:'below_fold', field:'g3_b3', value:'Support deep sleep, mental clarity, and sustained stamina.' },

  { page:'product', section:'nutrients',  field:'title',   value:'CoreVita Bee Pearl: The Ultimate Nutrient-Rich Superfood for Energy and Vitality' },
  { page:'product', section:'nutrients',  field:'subtitle',value:"Here's why we chose Bee Pearl for its powerful energy-boosting nutrients:" },

  { page:'product', section:'science', field:'title',      value:'The Science Supporting CoreVita' },
  { page:'product', section:'science', field:'subtitle',   value:'Results from clinical studies on Bee Bread & Propolis:' },
  { page:'product', section:'science', field:'stat1_pct',  value:'47' },
  { page:'product', section:'science', field:'stat1_text', value:'Reported a significant increase in daily energy and focus within just 21 days.' },
  { page:'product', section:'science', field:'stat2_pct',  value:'33' },
  { page:'product', section:'science', field:'stat2_text', value:'Experienced deeper, more restorative REM sleep cycles and woke up recharged.' },
  { page:'product', section:'science', field:'stat3_pct',  value:'62' },
  { page:'product', section:'science', field:'stat3_text', value:'Showed a measurable reduction in systemic inflammation markers and stress.' },
  { page:'product', section:'science', field:'stat4_pct',  value:'89' },
  { page:'product', section:'science', field:'stat4_text', value:'Noticed improved digestion and gut health due to natural bioactive enzymes.' },
  { page:'product', section:'science', field:'tagline',    value:"With CoreVita Bee Pearl, you're giving your body the nutrients it needs to thrive — backed by real results." },

  { page:'product', section:'reviews', field:'title',      value:'400+ People Are Already Thriving With The Healing Power Of Bee Pearl' },

  { page:'product', section:'videos', field:'title',        value:'Real Stories, Real Results: How CoreVita Is Changing Lives' },
  { page:'product', section:'videos', field:'video1_id',    value:'dQw4w9WgXcQ' },
  { page:'product', section:'videos', field:'video1_name',  value:'Sandra M., 62' },
  { page:'product', section:'videos', field:'video1_label', value:'Energy & Vitality' },
  { page:'product', section:'videos', field:'video2_id',    value:'dQw4w9WgXcQ' },
  { page:'product', section:'videos', field:'video2_name',  value:'James R., 55' },
  { page:'product', section:'videos', field:'video2_label', value:'Immune Support' },
  { page:'product', section:'videos', field:'video3_id',    value:'dQw4w9WgXcQ' },
  { page:'product', section:'videos', field:'video3_name',  value:'Linda K., 49' },
  { page:'product', section:'videos', field:'video3_label', value:'Mental Clarity' },
  { page:'product', section:'videos', field:'video4_id',    value:'dQw4w9WgXcQ' },
  { page:'product', section:'videos', field:'video4_name',  value:'Denise W., 58' },
  { page:'product', section:'videos', field:'video4_label', value:'Sleep & Recovery' },

  { page:'product', section:'faq', field:'q1', value:'How does it work?' },
  { page:'product', section:'faq', field:'a1', value:'Bee Pearl works by flooding your body with 20+ bioavailable amino acids, minerals, and enzymes. Unlike synthetic supplements, bee bread is pre-digested by bees making nutrients instantly absorbable by your cells.' },
  { page:'product', section:'faq', field:'q2', value:'What Bee Pearl Helps With' },
  { page:'product', section:'faq', field:'a2', value:'Vitality & Energy Support, Immune System Function, Nutritional Balance, Stress Resilience, Gentle Detoxification, and overall beauty & wellness.' },
  { page:'product', section:'faq', field:'q3', value:'When Will I See Results?' },
  { page:'product', section:'faq', field:'a3', value:'Most customers feel a difference within 7–14 days. By day 30, the majority notice sustained energy, clearer thinking, and improved mood.' },
  { page:'product', section:'faq', field:'q4', value:'Who Can Use It?' },
  { page:'product', section:'faq', field:'a4', value:'CoreVita Bee Pearl is suitable for adults of all ages. Especially beneficial for those 35+ who feel their vitality declining. Not recommended for those with bee product allergies.' },

  // ── POLICY PAGES ───────────────────────────────────────────────────────────
  { page:'policy', section:'refund',   field:'title', value:'Refund Policy' },
  { page:'policy', section:'refund',   field:'body',  value:'We stand behind our products 100%. If you\'re not completely satisfied with CoreVita Bee Pearl within 30 days of purchase, we\'ll give you a full refund — no questions asked.\n\n**How to Request a Refund**\nContact our support team at support@corevita.com. Include your order number and reason for return. We\'ll respond within 24 hours with return instructions.\n\n**Refund Processing**\nOnce we receive your return, refunds are processed within 5–7 business days to your original payment method.\n\n**Non-Refundable Items**\nItems that have been opened and used for more than 30 days are not eligible for a refund. Shipping costs are non-refundable.' },

  { page:'policy', section:'privacy',  field:'title', value:'Privacy Policy' },
  { page:'policy', section:'privacy',  field:'body',  value:'Last updated: January 2026\n\n**Information We Collect**\nWe collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you make a purchase.\n\n**How We Use Your Information**\nWe use your information to: process transactions, send order confirmations and updates, respond to your requests, and send marketing communications (with your consent).\n\n**Information Sharing**\nWe do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website.\n\n**Contact Us**\nIf you have any questions, please contact us at privacy@corevita.com.' },

  { page:'policy', section:'terms',    field:'title', value:'Terms of Service' },
  { page:'policy', section:'terms',    field:'body',  value:'Last updated: January 2026\n\n**Acceptance of Terms**\nBy accessing and using this website, you accept and agree to be bound by these Terms of Service.\n\n**Products and Services**\nCoreVita products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary.\n\n**Orders and Payment**\nAll orders are subject to availability. Payment is due at the time of order.\n\n**Subscription Terms**\nSubscriptions automatically renew monthly. You may cancel at any time through your account settings or by contacting support.' },

  { page:'policy', section:'shipping', field:'title', value:'Shipping Policy' },
  { page:'policy', section:'shipping', field:'body',  value:'**Free Shipping**\nFree standard shipping on all US orders over $50.\n\n**Processing Time**\nOrders are processed within 1–2 business days. You\'ll receive a tracking number via email once your order ships.\n\n**Delivery Times**\nStandard Shipping (US): 5–8 business days\nExpedited Shipping (US): 2–3 business days\nInternational: 10–21 business days\n\n**International Orders**\nInternational customers are responsible for any customs duties, taxes, or fees imposed by their country.' },
];

// PUBLIC: get all content for a page
router.get('/:page', async (req, res) => {
  try {
    const docs = await PageContent.find({ page: req.params.page });
    if (docs.length === 0) {
      const pageDefaults = DEFAULTS.filter(d => d.page === req.params.page);
      if (pageDefaults.length) {
        try {
          const inserted = await PageContent.insertMany(pageDefaults, { ordered: false });
          return res.json(inserted);
        } catch {
          const docs = await PageContent.find({ page: req.params.page });
          if (docs.length) return res.json(docs);
          return res.json(pageDefaults);
        }
      }
    }
    res.json(docs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: get ALL content
router.get('/', adminAuth, async (req, res) => {
  try {
    const docs = await PageContent.find().sort({ page: 1, section: 1, field: 1 });
    if (docs.length === 0) {
      await PageContent.insertMany(DEFAULTS, { ordered: false }).catch(() => {});
      return res.json(DEFAULTS);
    }
    res.json(docs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: bulk upsert content for a page
router.put('/:page', adminAuth, async (req, res) => {
  try {
    const { fields } = req.body;
    const ops = fields.map(({ section, field, value }) => ({
      updateOne: {
        filter: { page: req.params.page, section, field },
        update: { $set: { value } },
        upsert: true,
      }
    }));
    await PageContent.bulkWrite(ops);
    const updated = await PageContent.find({ page: req.params.page });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ADMIN: reset page to defaults
router.post('/:page/reset', adminAuth, async (req, res) => {
  try {
    await PageContent.deleteMany({ page: req.params.page });
    const pageDefaults = DEFAULTS.filter(d => d.page === req.params.page);
    const inserted = await PageContent.insertMany(pageDefaults, { ordered: false });
    res.json(inserted.length ? inserted : pageDefaults);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
module.exports.DEFAULTS = DEFAULTS;