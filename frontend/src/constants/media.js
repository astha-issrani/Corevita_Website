/** Local + default media assets for product page */

export const IMG = {
  bottle: '/images/bee-pearl-bottle.svg',
  bannerModernFood: '/images/banner-modern-food.svg',
  bannerBottle: '/images/bee-pearl-bottle.svg',
  capsulesBowl: '/images/capsules-bowl.svg',
  galleryCapsules: '/images/gallery-capsules.svg',
  gallerySupplements: '/images/gallery-supplements.svg',
  galleryHoney: '/images/gallery-honey-wellness.svg',
  galleryLifestyle: '/images/gallery-lifestyle.svg',
};

export const DEFAULT_GALLERY_IMAGES = [
  IMG.bottle,
  IMG.galleryCapsules,
  IMG.gallerySupplements,
  IMG.galleryHoney,
  IMG.galleryLifestyle,
];

export const DEFAULT_CAPSULES_IMAGE = IMG.capsulesBowl;

/** Prefer local assets; ignore broken remote URLs from old DB seeds */
export function resolveBannerImage(url, fallback) {
  if (!url || !String(url).trim()) return fallback;
  const u = String(url).trim();
  if (u.startsWith('/images/')) return u;
  if (u.includes('unsplash.com') || u.includes('placeholder')) return fallback;
  return u;
}

/** Free Mixkit MP4s — HTML5 video with controls, sound enabled when user plays */
export const DEFAULT_TESTIMONIAL_VIDEOS = [
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-taking-pills-from-a-container-3982-large.mp4',
    name: 'Sandra M., 62',
    label: 'Energy & Vitality',
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-yellow-pills-and-capsules-3983-large.mp4',
    name: 'James R., 55',
    label: 'Immune Support',
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-drinking-a-green-juice-smoothie-4635-large.mp4',
    name: 'Linda K., 49',
    label: 'Mental Clarity',
  },
  {
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-on-a-mat-32809-large.mp4',
    name: 'Denise W., 58',
    label: 'Sleep & Recovery',
  },
];

/** Resolve video URL from admin content (supports legacy YouTube ID field) */
export function resolveVideoUrl(c, index) {
  const n = index + 1;
  const defaults = DEFAULT_TESTIMONIAL_VIDEOS[index];
  const urlField = c('videos', `video${n}_url`, '');
  const legacy = c('videos', `video${n}_id`, '');
  const candidate = urlField || (legacy && legacy.includes('.mp4') ? legacy : '');
  if (candidate && (candidate.startsWith('http') || candidate.startsWith('/'))) {
    return candidate;
  }
  return defaults?.url || '';
}
