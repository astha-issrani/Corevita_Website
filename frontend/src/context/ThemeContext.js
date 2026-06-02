import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

export const FONT_OPTIONS = [
  { label: 'Geist (Heading)', value: 'Geist', category: 'sans-serif' },
  { label: 'Inter (Body)', value: 'Inter', category: 'sans-serif' },
  { label: 'Barlow', value: 'Barlow', category: 'sans-serif' },
  { label: 'Poppins', value: 'Poppins', category: 'sans-serif' },
  { label: 'Nunito', value: 'Nunito', category: 'sans-serif' },
  { label: 'Lato', value: 'Lato', category: 'sans-serif' },
  { label: 'Montserrat', value: 'Montserrat', category: 'sans-serif' },
  { label: 'Raleway', value: 'Raleway', category: 'sans-serif' },
  { label: 'Rubik', value: 'Rubik', category: 'sans-serif' },
  { label: 'DM Sans', value: 'DM Sans', category: 'sans-serif' },
  { label: 'Outfit', value: 'Outfit', category: 'sans-serif' },
  { label: 'Barlow Condensed', value: 'Barlow Condensed', category: 'condensed' },
  { label: 'Oswald', value: 'Oswald', category: 'condensed' },
  { label: 'Bebas Neue', value: 'Bebas Neue', category: 'condensed' },
  { label: 'Anton', value: 'Anton', category: 'condensed' },
  { label: 'Black Han Sans', value: 'Black Han Sans', category: 'condensed' },
  { label: 'Playfair Display', value: 'Playfair Display', category: 'serif' },
  { label: 'Merriweather', value: 'Merriweather', category: 'serif' },
  { label: 'Lora', value: 'Lora', category: 'serif' },
  { label: 'Georgia', value: 'Georgia', category: 'serif' },
  { label: 'JetBrains Mono', value: 'JetBrains Mono', category: 'mono' },
  { label: 'Space Mono', value: 'Space Mono', category: 'mono' },
];

export const DEFAULT_FONTS = {
  heading: 'Geist',
  body: 'Inter',
  card: 'Inter',
  price: 'Geist',
  button: 'Inter',
  nav: 'Geist',
};

export const DEFAULT_FONT_SIZES = {
  heading: '29',
  body: '16',
};

/** Black & white default theme */
export const DEFAULT_COLORS = {
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

export const COLOR_PRESETS = {
  'Black & White': DEFAULT_COLORS,
  'CoreVita Yellow': {
    primary: '#F5C800',
    primaryDark: '#E6B800',
    primaryLight: '#FFF8CC',
    primaryBg: '#FFFBEB',
    black: '#111111',
    white: '#FFFFFF',
    grayLight: '#F7F7F7',
    gray: '#888888',
    grayDark: '#444444',
    green: '#22C55E',
    red: '#EF4444',
  },
};

const ThemeContext = createContext();

function loadGoogleFont(fontName) {
  if (!fontName || fontName === 'Georgia') return;
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@200;300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

function applyFonts(fonts) {
  const root = document.documentElement;
  const f = { ...DEFAULT_FONTS, ...fonts };
  Object.values(f).forEach(loadGoogleFont);
  root.style.setProperty('--font-heading', `'${f.heading}', sans-serif`);
  root.style.setProperty('--font-main', `'${f.body}', sans-serif`);
  root.style.setProperty('--font-card', `'${f.card}', sans-serif`);
  root.style.setProperty('--font-price', `'${f.price}', sans-serif`);
  root.style.setProperty('--font-button', `'${f.button}', sans-serif`);
  root.style.setProperty('--font-nav', `'${f.nav}', sans-serif`);
}

function applyFontSizes(sizes) {
  const root = document.documentElement;
  const s = { ...DEFAULT_FONT_SIZES, ...sizes };
  root.style.setProperty('--font-size-heading', `${s.heading}px`);
  root.style.setProperty('--font-size-body', `${s.body}px`);
}

function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h;
  if (full.length !== 6) return null;
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Text color that contrasts with a solid primary/accent background */
export function getContrastText(hex, light = '#FFFFFF', dark = '#111111') {
  const rgb = hexToRgb(hex);
  if (!rgb) return dark;
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? dark : light;
}

export function applyColors(colors) {
  const root = document.documentElement;
  const c = { ...DEFAULT_COLORS, ...colors };
  const onPrimary = getContrastText(c.primary, c.white, c.black);

  root.style.setProperty('--yellow', c.primary);
  root.style.setProperty('--yellow-dark', c.primaryDark);
  root.style.setProperty('--yellow-light', c.primaryLight);
  root.style.setProperty('--yellow-bg', c.primaryBg);
  root.style.setProperty('--black', c.black);
  root.style.setProperty('--white', c.white);
  root.style.setProperty('--gray-light', c.grayLight);
  root.style.setProperty('--gray', c.gray);
  root.style.setProperty('--gray-dark', c.grayDark);
  root.style.setProperty('--green', c.green);
  root.style.setProperty('--red', c.red);
  root.style.setProperty('--primary', c.primary);
  root.style.setProperty('--primary-dark', c.primaryDark);
  root.style.setProperty('--on-primary', onPrimary);

  /* Admin panel tokens — stay in sync with storefront theme */
  root.style.setProperty('--admin-page-bg', c.grayLight);
  root.style.setProperty('--admin-surface', c.white);
  root.style.setProperty('--admin-sidebar-bg', c.white);
  root.style.setProperty('--admin-text', c.black);
  root.style.setProperty('--admin-text-muted', c.gray);
  root.style.setProperty('--admin-accent', c.primary);
  root.style.setProperty('--admin-accent-hover', c.primaryDark);
  root.style.setProperty('--admin-accent-soft', c.primaryBg);
  root.style.setProperty('--admin-accent-light', c.primaryLight);
  root.style.setProperty('--admin-brand-bg', c.primary);
  root.style.setProperty('--admin-brand-text', onPrimary);
}

export function ThemeProvider({ children }) {
  const [fonts, setFonts] = useState(DEFAULT_FONTS);
  const [fontSizes, setFontSizes] = useState(DEFAULT_FONT_SIZES);
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/settings/fonts`),
      axios.get(`${API}/api/settings/font-sizes`),
      axios.get(`${API}/api/settings/colors`),
    ])
      .then(([fontsRes, sizesRes, colorsRes]) => {
        const mergedFonts = fontsRes.data.value
          ? { ...DEFAULT_FONTS, ...fontsRes.data.value }
          : DEFAULT_FONTS;
        const mergedSizes = sizesRes.data.value
          ? { ...DEFAULT_FONT_SIZES, ...sizesRes.data.value }
          : DEFAULT_FONT_SIZES;
        const mergedColors = colorsRes.data.value
          ? { ...DEFAULT_COLORS, ...colorsRes.data.value }
          : DEFAULT_COLORS;
        setFonts(mergedFonts);
        setFontSizes(mergedSizes);
        setColors(mergedColors);
        applyFonts(mergedFonts);
        applyFontSizes(mergedSizes);
        applyColors(mergedColors);
      })
      .catch(() => {
        applyFonts(DEFAULT_FONTS);
        applyFontSizes(DEFAULT_FONT_SIZES);
        applyColors(DEFAULT_COLORS);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateFonts = (newFonts) => {
    const merged = { ...fonts, ...newFonts };
    setFonts(merged);
    applyFonts(merged);
  };

  const updateFontSizes = (newSizes) => {
    const merged = { ...fontSizes, ...newSizes };
    setFontSizes(merged);
    applyFontSizes(merged);
  };

  const updateColors = (newColors) => {
    const merged = { ...colors, ...newColors };
    setColors(merged);
    applyColors(merged);
  };

  const saveFonts = async (fontsToSave) => {
    const token = localStorage.getItem('corevita_token');
    const { data } = await axios.put(
      `${API}/api/settings/fonts`,
      { value: fontsToSave },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  const saveFontSizes = async (sizesToSave) => {
    const token = localStorage.getItem('corevita_token');
    const { data } = await axios.put(
      `${API}/api/settings/font-sizes`,
      { value: sizesToSave },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  const saveColors = async (colorsToSave) => {
    const token = localStorage.getItem('corevita_token');
    const { data } = await axios.put(
      `${API}/api/settings/colors`,
      { value: colorsToSave },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  return (
    <ThemeContext.Provider value={{
      fonts, fontSizes, colors,
      updateFonts, updateFontSizes, updateColors,
      saveFonts, saveFontSizes, saveColors,
      loading,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
