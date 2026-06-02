const Product = require('./models/Product');
const Settings = require('./models/Settings');

const BRAND_FONTS = {
  heading: 'Geist',
  body: 'Inter',
  card: 'Inter',
  price: 'Geist',
  button: 'Inter',
  nav: 'Geist',
};

const DEFAULT_THEME_COLORS = {
  primary: '#111111',
  primaryDark: '#000000',
  primaryLight: '#E5E5E5',
  primaryBg: '#F5F5F5',
  black: '#111111',
  white: '#FFFFFF',
  grayLight: '#F7F7F7',
  gray: '#888888',
  grayDark: '#444444',
  green: '#22C55E',
  red: '#EF4444',
};

const DEFAULT_PRODUCT_IMAGES = [
  '/images/bee-pearl-bottle.svg',
  '/images/gallery-capsules.svg',
  '/images/gallery-supplements.svg',
  '/images/gallery-honey-wellness.svg',
  '/images/gallery-lifestyle.svg',
];

const seedBlog = require('./seedBlog');

module.exports = async function seedData() {
  try {
    const existingFonts = await Settings.findOne({ key: 'fonts' });
    const isOldDefault = !existingFonts?.value
      || Object.values(existingFonts.value).every((v) => v === 'Poppins');
    if (isOldDefault) {
      await Settings.findOneAndUpdate(
        { key: 'fonts' },
        { key: 'fonts', value: BRAND_FONTS },
        { upsert: true }
      );
      console.log('Updated brand fonts to Geist + Inter');
    }

    const existingColors = await Settings.findOne({ key: 'colors' });
    const isYellowDefault = !existingColors?.value
      || existingColors.value.primary === '#F5C800';
    if (isYellowDefault) {
      await Settings.findOneAndUpdate(
        { key: 'colors' },
        { key: 'colors', value: DEFAULT_THEME_COLORS },
        { upsert: true }
      );
      console.log('Updated theme colors to Black & White default');
    }

    await seedBlog();
    const existing = await Product.findOne({ slug: 'bee-pearl' });
    if (existing) {
      if (!existing.images || existing.images.length < 3) {
        await Product.updateOne({ slug: 'bee-pearl' }, { $set: { images: DEFAULT_PRODUCT_IMAGES } });
        console.log('Updated bee-pearl gallery images');
      }
      return;
    }

    await Product.create({
      name: 'CoreVita Bee Pearl Capsules',
      slug: 'bee-pearl',
      tagline: 'Restore Natural Vitality — The Hidden Root Cause Behind Faster Aging',
      description: 'CoreVita Bee Pearl is designed to restore natural vitality — the hidden root cause behind faster aging, nutrient depletion, and accelerated weight gain. Just one daily dose helps restore balance from within — naturally supporting your steady energy, recovery, and mental clarity.',
      price: 49.99,
      originalPrice: 79.99,
      savingsPercent: 37,
      rating: 4.7,
      reviewCount: 400,
      stockLeft: 23,
      images: DEFAULT_PRODUCT_IMAGES,
      benefits: [
        'All day energy without any crashes',
        'Strengthens natural immune defense',
        'Sharper focus & mental clarity',
        'Rich in vitamins for faster recovery',
      ],
      packs: [
        {
          label: 'Buy 1 + Get 1 FREE',
          quantity: 2,
          price: 44.99,
          originalPrice: 159.98,
          savingsPercent: 72,
          badge: '',
          freeShipping: false,
        },
        {
          label: 'Buy 2 + Get 2 FREE',
          quantity: 4,
          price: 89.98,
          originalPrice: 319.96,
          savingsPercent: 72,
          badge: 'Most Popular',
          freeShipping: true,
        },
        {
          label: 'Buy 3 + Get 3 FREE',
          quantity: 6,
          price: 134.97,
          originalPrice: 479.94,
          savingsPercent: 72,
          badge: 'Best Deal',
          freeShipping: true,
        },
      ],
      ingredients: 'Bee Bread (Perga), Bee Pollen, Royal Jelly, Propolis Extract. Contains 20+ amino acids, vitamins B1, B2, B3, B5, B6, B12, C, D, E, K, minerals including zinc, magnesium, calcium, iron, and digestive enzymes.',
      howItWorks: 'Bee Pearl works by flooding your body with the 20+ amino acids, minerals, and enzymes it\'s been starved of. Unlike synthetic supplements, bee bread is pre-digested by bees, making nutrients 100% bioavailable. Your cells can finally absorb what they\'ve been missing.',
      whatItHelpsWith: [
        'Vitality & Energy Support',
        'Immune System Function',
        'Nutritional Balance',
        'Stress Resilience',
        'Gentle Detoxification',
        'Beauty Standards',
      ],
      whenToSeeResults: 'Most customers report feeling a difference within the first 7–14 days. By day 30, the majority notice sustained energy, clearer thinking, and improved mood. Full results typically develop over 60–90 days of consistent use.',
      whoCanUse: 'CoreVita Bee Pearl is suitable for adults of all ages looking to restore energy, improve focus, and support overall wellness. It\'s especially beneficial for those 35+ who feel their vitality declining. Not recommended for those with bee product allergies.',
      category: 'supplements',
      featured: true,
    });

    console.log('Seed data created');
  } catch (err) {
    console.log('Seed error:', err.message);
  }
};
