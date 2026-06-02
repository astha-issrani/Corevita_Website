import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

// Available Google Fonts grouped by style
export const FONT_OPTIONS = [
  // Sans-serif (clean, modern)
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
  // Condensed / Display
  { label: 'Barlow Condensed (Default Heading)', value: 'Barlow Condensed', category: 'condensed' },
  { label: 'Oswald', value: 'Oswald', category: 'condensed' },
  { label: 'Bebas Neue', value: 'Bebas Neue', category: 'condensed' },
  { label: 'Anton', value: 'Anton', category: 'condensed' },
  { label: 'Black Han Sans', value: 'Black Han Sans', category: 'condensed' },
  // Serif
  { label: 'Playfair Display', value: 'Playfair Display', category: 'serif' },
  { label: 'Merriweather', value: 'Merriweather', category: 'serif' },
  { label: 'Lora', value: 'Lora', category: 'serif' },
  { label: 'Georgia', value: 'Georgia', category: 'serif' },
  // Mono
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

const ThemeContext = createContext();

// Inject a Google Font <link> into <head> if not already loaded
function loadGoogleFont(fontName) {
  if (!fontName || fontName === 'Georgia') return; // system font
  const id = `gfont-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@200;300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
}

// Apply fonts to CSS variables on :root
function applyFonts(fonts) {
  const root = document.documentElement;
  const f = { ...DEFAULT_FONTS, ...fonts };

  // Load all needed Google Fonts
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

export function ThemeProvider({ children }) {
  const [fonts, setFonts] = useState(DEFAULT_FONTS);
  const [fontSizes, setFontSizes] = useState(DEFAULT_FONT_SIZES);
  const [loading, setLoading] = useState(true);

  // Load saved fonts from backend on mount
  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/settings/fonts`),
      axios.get(`${API}/api/settings/font-sizes`),
    ])
      .then(([fontsRes, sizesRes]) => {
        const mergedFonts = fontsRes.data.value
          ? { ...DEFAULT_FONTS, ...fontsRes.data.value }
          : DEFAULT_FONTS;
        const mergedSizes = sizesRes.data.value
          ? { ...DEFAULT_FONT_SIZES, ...sizesRes.data.value }
          : DEFAULT_FONT_SIZES;
        setFonts(mergedFonts);
        setFontSizes(mergedSizes);
        applyFonts(mergedFonts);
        applyFontSizes(mergedSizes);
      })
      .catch(() => {
        applyFonts(DEFAULT_FONTS);
        applyFontSizes(DEFAULT_FONT_SIZES);
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

  const saveFonts = async (fontsToSave) => {
    const token = localStorage.getItem('corevita_token');
    const { data } =
    await axios.put(
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

  return (
    <ThemeContext.Provider value={{
      fonts, fontSizes, updateFonts, updateFontSizes, saveFonts, saveFontSizes, loading,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);