const BlogPost = require('./models/BlogPost');

const DEFAULT_POSTS = [
  {
    title: 'Why Bee Bread Beats Synthetic Multivitamins',
    slug: 'why-bee-bread-beats-synthetic-multivitamins',
    excerpt: 'Most tablets pass through your body unused. Here is why pre-digested bee bread is different.',
    coverImage: '/images/capsules-bowl.svg',
    body: `**Bee bread** (perga) is not a lab-made blend of isolated vitamins. It is a *living superfood* created by bees — fermented, predigested, and packed with nutrients your cells recognize.

Unlike synthetic multivitamins, bee bread delivers **enzymes, amino acids, and B-vitamins** in forms your gut can absorb without fighting binders and fillers.

Learn more on our [CoreVita Bee Pearl product page](/products/bee-pearl).`,
  },
  {
    title: '5 Signs Your Body Is Running on Empty',
    slug: 'five-signs-your-body-is-running-on-empty',
    excerpt: 'Afternoon crashes, brain fog, and poor recovery often trace back to nutrient gaps — not lack of coffee.',
    coverImage: '/images/banner-modern-food.svg',
    body: `Modern food looks full but often delivers *empty calories*. If you recognize these patterns, your body may be asking for **real nutrition**, not more stimulation:

**1. Daily fatigue by 2 PM** — classic sign of micronutrient gaps.

**2. Brain fog** — B-vitamins and amino acids support focus.

**3. Slow recovery** — tissue repair needs minerals and protein building blocks.

**4. Frequent colds** — immune cells need zinc, vitamin C, and antioxidants.

**5. Poor sleep** — magnesium and nervous-system nutrients matter.

CoreVita Bee Pearl bridges these gaps with concentrated bee bread. [Shop CoreVita](/products/bee-pearl).`,
  },
  {
    title: 'The Science Behind CoreVita Bee Pearl',
    slug: 'science-behind-corevita-bee-pearl',
    excerpt: 'Clinical interest in bee bread, propolis, and pollen supports vitality, immunity, and energy.',
    coverImage: '/images/bee-pearl-bottle.svg',
    body: `Research on **bee bread and bee pollen** highlights bioactive compounds that support:

*Natural energy metabolism*

*Immune function*

*Oxidative stress balance*

CoreVita combines traditional hive wisdom with modern quality standards — **no synthetic crash**, just steady support from whole-food nutrition.

Read customer stories on our [product page](/products/bee-pearl).`,
  },
  {
    title: 'How to Take Bee Pearl for Best Results',
    slug: 'how-to-take-bee-pearl-for-best-results',
    excerpt: 'One daily capsule, consistency, and realistic expectations — a simple routine that works.',
    coverImage: '/images/gallery-lifestyle.svg',
    body: `**Take one capsule daily** with water, preferably with breakfast. Consistency matters more than timing perfection.

Most customers notice **energy and clarity within 1–2 weeks**; deeper benefits often build over 30–60 days.

Pair with whole foods, sleep, and movement — supplements *support* health; they do not replace lifestyle.

Questions? [Contact our team](/contact).`,
  },
  {
    title: 'Modern Soil, Empty Plates: The Nutrition Crisis',
    slug: 'modern-soil-empty-plates',
    excerpt: 'Why your grandparents got more nutrition from less food — and what you can do about it.',
    coverImage: '/images/banner-modern-food.svg',
    body: `Industrial agriculture prioritizes yield over nutrient density. Studies show declining mineral content in crops over decades.

That means **you may need to eat more** just to get what previous generations received from a normal plate.

Bee Pearl offers a concentrated, bioavailable source of vitamins, minerals, and enzymes — a practical bridge when diet alone is not enough.

Explore [CoreVita Bee Pearl](/products/bee-pearl).`,
  },
  {
    title: 'Bee Pearl vs. Energy Drinks: A Smarter Choice',
    slug: 'bee-pearl-vs-energy-drinks',
    excerpt: 'Stimulation borrows energy from tomorrow. Nutrition helps your body produce it naturally.',
    coverImage: '/images/gallery-honey-wellness.svg',
    body: `Energy drinks spike caffeine and sugar — a short boost followed by a **crash**.

*Bee Pearl works differently*: it replenishes cofactors your mitochondria use to make ATP — real cellular energy.

No jitters. No 3 PM slump. Just **steady vitality** when you use it consistently.

[Try CoreVita today](/products/bee-pearl).`,
  },
  {
    title: 'Immune Support From the Hive',
    slug: 'immune-support-from-the-hive',
    excerpt: 'Propolis, pollen, and bee bread have long been valued for seasonal wellness.',
    coverImage: '/images/gallery-supplements.svg',
    body: `Hive products contain **antioxidants, flavonoids, and immune-modulating compounds** studied for their role in seasonal defense.

Bee Pearl brings these traditions into a convenient daily capsule — alongside B-vitamins and minerals that support immune cell function.

Support your routine before busy seasons. [Learn more](/products/bee-pearl).`,
  },
  {
    title: 'Customer Stories: Energy After 40',
    slug: 'customer-stories-energy-after-40',
    excerpt: 'Real feedback from adults who wanted steady energy without another cup of coffee.',
    coverImage: '/images/gallery-capsules.svg',
    body: `Many CoreVita customers are **40+ professionals** tired of depending on coffee to get through the day.

Common themes in reviews:

*More stable afternoon energy*

*Clearer thinking at work*

*Fewer sick days during busy seasons*

Your results may vary — but thousands of customers rate Bee Pearl highly. [Read reviews on the product page](/products/bee-pearl).`,
  },
];

module.exports = async function seedBlog() {
  try {
    const count = await BlogPost.countDocuments();
    if (count > 0) return;
    const now = Date.now();
    await BlogPost.insertMany(
      DEFAULT_POSTS.map((p, i) => ({
        ...p,
        author: 'CoreVita Team',
        published: true,
        publishedAt: new Date(now - i * 86400000 * 3),
      }))
    );
    console.log(`Seeded ${DEFAULT_POSTS.length} blog posts`);
  } catch (err) {
    console.error('Blog seed error:', err.message);
  }
};
