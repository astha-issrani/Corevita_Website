import React, { useState, useEffect } from 'react';
import { useTheme, COLOR_PRESETS, DEFAULT_COLORS } from '../context/ThemeContext';
import { AdminIcon } from '../components/admin/AdminIcons';
import './AdminTheme.css';

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary / Accent', description: 'Buttons, highlights, active states' },
  { key: 'primaryDark', label: 'Primary Dark', description: 'Hover states, emphasis' },
  { key: 'primaryLight', label: 'Primary Light', description: 'Soft accents' },
  { key: 'primaryBg', label: 'Primary Background', description: 'Tinted section backgrounds' },
  { key: 'black', label: 'Text / Dark', description: 'Headings and body text' },
  { key: 'white', label: 'Background White', description: 'Page background' },
  { key: 'grayLight', label: 'Light Gray', description: 'Cards and sections' },
];

export default function AdminTheme() {
  const { colors, updateColors, saveColors } = useTheme();
  const [local, setLocal] = useState(colors);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { setLocal(colors); }, [colors]);

  const handleChange = (key, value) => {
    const next = { ...local, [key]: value };
    setLocal(next);
    updateColors(next);
  };

  const applyPreset = (presetKey) => {
    const preset = COLOR_PRESETS[presetKey];
    if (!preset) return;
    setLocal(preset);
    updateColors(preset);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await saveColors(local);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save theme. Make sure you are logged in as admin.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setLocal(DEFAULT_COLORS);
    updateColors(DEFAULT_COLORS);
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Website Theme</h1>
          <p>Customize colors across the storefront and admin panel — changes preview instantly</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className="refresh-btn" style={{ background: '#f3f4f6', color: '#333' }} onClick={handleReset}>
            <AdminIcon name="reset" size={14} /> Reset Defaults
          </button>
          <button
            type="button"
            className="refresh-btn"
            style={{ background: saved ? '#10b981' : 'var(--yellow)', color: saved ? 'white' : 'var(--white)', minWidth: 120 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : saved ? <><AdminIcon name="check" size={14} /> Saved!</> : 'Save Theme'}
          </button>
        </div>
      </div>

      {error && <div className="font-error">{error}</div>}

      <div className="theme-panel">
        <section className="theme-section">
          <h3>Presets</h3>
          <div className="theme-presets">
            {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
              <button key={key} type="button" className="theme-preset-card" onClick={() => applyPreset(key)}>
                <div className="theme-preset-swatches">
                  <span style={{ background: preset.primary }} />
                  <span style={{ background: preset.black }} />
                  <span style={{ background: preset.white, border: '1px solid #ddd' }} />
                </div>
                <span className="theme-preset-name">{key}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="theme-section">
          <h3>Custom Colors</h3>
          <div className="theme-colors-grid">
            {COLOR_FIELDS.map(({ key, label, description }) => (
              <div key={key} className="theme-color-field">
                <div className="theme-color-label">
                  <span>{label}</span>
                  <small>{description}</small>
                </div>
                <div className="theme-color-input-wrap">
                  <input
                    type="color"
                    value={local[key] || DEFAULT_COLORS[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                  <input
                    type="text"
                    className="ac-input"
                    value={local[key] || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="theme-section">
          <h3>Live Preview</h3>
          <div className="theme-preview">
            <div className="theme-preview-nav" style={{ background: local.black, color: local.white }}>
              <span>COREVITA</span>
              <span style={{ opacity: 0.7 }}>Shop · About · Contact</span>
            </div>
            <div className="theme-preview-hero" style={{ background: local.white }}>
              <h2 style={{ color: local.black }}>Restore Natural Vitality</h2>
              <p style={{ color: local.gray || '#888' }}>Premium bee pearl supplements for daily wellness.</p>
              <button type="button" className="theme-preview-btn" style={{ background: local.primary, color: local.white }}>
                SHOP NOW
              </button>
              <div className="theme-preview-card" style={{ background: local.primaryBg, borderColor: local.primaryLight }}>
                <strong style={{ color: local.black }}>Buy 1 + Get 1 FREE</strong>
                <span style={{ color: local.primaryDark }}>$44.99</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
