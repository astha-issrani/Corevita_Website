import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Available Google Fonts grouped by style
export const FONT_OPTIONS = [
  // Sans-serif (clean, modern)
  { label: 'Barlow (Default)', value: 'Barlow', category: 'sans-serif' },
  { label: 'Inter', value: 'Inter', category: 'sans-serif' },
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
  heading: 'Barlow Condensed',
  body: 'Barlow',
  card: 'Barlow',
  price: 'Barlow Condensed',
  button: 'Barlow',
  nav: 'Barlow',
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
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;500;600;700;800;900&display=swap`;
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

export function ThemeProvider({ children }) {
  const [fonts, setFonts] = useState(DEFAULT_FONTS);
  const [loading, setLoading] = useState(true);

  // Load saved fonts from backend on mount
  useEffect(() => {
    axios.get(`${API}/settings/fonts`)
      .then(({ data }) => {
        if (data.value) {
          const merged = { ...DEFAULT_FONTS, ...data.value };
          setFonts(merged);
          applyFonts(merged);
        } else {
          applyFonts(DEFAULT_FONTS);
        }
      })
      .catch(() => {
        // Backend unavailable — use defaults
        applyFonts(DEFAULT_FONTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateFonts = (newFonts) => {
    const merged = { ...fonts, ...newFonts };
    setFonts(merged);
    applyFonts(merged);
  };

  const saveFonts = async (fontsToSave) => {
    const token = localStorage.getItem('corevita_token');
    const { data } = await axios.put(
      `${API}/settings/fonts`,
      { value: fontsToSave },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  };

  return (
    <ThemeContext.Provider value={{ fonts, updateFonts, saveFonts, loading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);