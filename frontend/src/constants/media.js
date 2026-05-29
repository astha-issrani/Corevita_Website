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

const BLOCKED_IMAGE_HOSTS = [
  'unsplash.com',
  'placeholder',
  'mixkit.co',
  'pexels.com',
  'pixabay.com',
  'placehold.co',
  'picsum.photos',
];

/** Prefer local assets; ignore broken remote URLs from old DB seeds */
export function resolveBannerImage(url, fallback) {
  if (!url || !String(url).trim()) return fallback;
  const u = String(url).trim();
  if (u.startsWith('/images/')) return u;
  if (BLOCKED_IMAGE_HOSTS.some((h) => u.includes(h))) return fallback;
  return u;
}

export function resolveMediaImage(url, fallback) {
  return resolveBannerImage(url, fallback);
}

const GTV_SAMPLE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample';

/** HTML5 MP4 samples with audio — use browser controls to play unmuted */
export const DEFAULT_TESTIMONIAL_VIDEOS = [
  {
    url: `${GTV_SAMPLE}/ForBiggerBlazes.mp4`,
    name: 'Sandra M., 62',
    label: 'Energy & Vitality',
  },
  {
    url: `${GTV_SAMPLE}/ForBiggerEscapes.mp4`,
    name: 'James R., 55',
    label: 'Immune Support',
  },
  {
    url: `${GTV_SAMPLE}/ForBiggerBlazes.mp4`,
    name: 'Linda K., 49',
    label: 'Mental Clarity',
  },
  {
    url: `${GTV_SAMPLE}/ForBiggerEscapes.mp4`,
    name: 'Denise W., 58',
    label: 'Sleep & Recovery',
  },
];

function isUsableVideoUrl(url) {
  if (!url || !String(url).trim()) return false;
  const u = String(url).trim();
  if (u.includes('mixkit.co')) return false;
  if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return false;
  return u.startsWith('http') || u.startsWith('/');
}

/** Resolve video URL from admin content (ignores old YouTube IDs / Mixkit links) */
export function resolveVideoUrl(c, index) {
  const n = index + 1;
  const defaults = DEFAULT_TESTIMONIAL_VIDEOS[index];
  const urlField = c('videos', `video${n}_url`, '');
  const legacy = c('videos', `video${n}_id`, '');
  const candidate = urlField || legacy;
  if (isUsableVideoUrl(candidate)) return candidate.trim();
  return defaults?.url || '';
}
