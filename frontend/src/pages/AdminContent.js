import React, { useState, useEffect, useCallback } from 'react';
import { invalidateContent } from '../utils/useContent';
import RichTextEditor from '../components/RichTextEditor';
import { AdminIcon } from '../components/admin/AdminIcons';
import './AdminContent.css';

const BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';
const token = () => localStorage.getItem('corevita_token');
const hdrs = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

const PAGES = [
  {
    key: 'home', label: 'Home Page', icon: 'home',
    sections: [
      {
        key: 'hero', label: 'Hero Section',
        fields: [
          { key: 'badge',    label: 'Stars Badge',  type: 'text' },
          { key: 'title',    label: 'Main Title',   type: 'textarea', rows: 4 },
          { key: 'subtitle', label: 'Subtitle',     type: 'text' },
          { key: 'body',     label: 'Pitch Paragraph', type: 'textarea', rows: 4 },
          { key: 'cta',      label: 'CTA Button',   type: 'text' },
        ]
      },
      {
        key: 'why', label: 'Why Modern Food Section',
        fields: [
          { key: 'title',      label: 'Section Title',     type: 'text' },
          { key: 'body1',      label: 'Paragraph',         type: 'textarea', rows: 3 },
          { key: 'stat1_pct',  label: 'Stat 1 %',          type: 'text' },
          { key: 'stat1_text', label: 'Stat 1 Text',       type: 'textarea', rows: 2 },
          { key: 'stat2_pct',  label: 'Stat 2 %',          type: 'text' },
          { key: 'stat2_text', label: 'Stat 2 Text',       type: 'textarea', rows: 2 },
          { key: 'body2',      label: 'Bottom Paragraph',  type: 'textarea', rows: 3 },
          { key: 'cta',        label: 'CTA Button',        type: 'text' },
        ]
      },
      {
        key: 'results', label: 'Real Results Section',
        fields: [
          { key: 'title',      label: 'Title',       type: 'text' },
          { key: 'subtitle',   label: 'Subtitle',    type: 'text' },
          { key: 'heading',    label: 'Stats Column Heading', type: 'text' },
          { key: 'stat1_pct',  label: 'Stat 1 %',   type: 'text' },
          { key: 'stat1_text', label: 'Stat 1 Text', type: 'textarea', rows: 2 },
          { key: 'stat2_pct',  label: 'Stat 2 %',   type: 'text' },
          { key: 'stat2_text', label: 'Stat 2 Text', type: 'textarea', rows: 2 },
          { key: 'stat3_pct',  label: 'Stat 3 %',   type: 'text' },
          { key: 'stat3_text', label: 'Stat 3 Text', type: 'textarea', rows: 2 },
        ]
      },
      {
        key: 'stories', label: 'Stories Section',
        fields: [{ key: 'title', label: 'Section Title', type: 'text' }]
      },
      {
        key: 'cta_banner', label: 'Bottom CTA Banner',
        fields: [
          { key: 'title',    label: 'Title',    type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'cta',      label: 'Button',   type: 'text' },
        ]
      },
    ]
  },
  {
    key: 'product', label: 'Product Detail Page', icon: 'product',
    sections: [
      {
        key: 'hero', label: 'Product Hero',
        fields: [
          { key: 'title', label: 'Product Title',    type: 'text' },
          { key: 'desc1', label: 'Description 1',    type: 'textarea', rows: 3 },
          { key: 'desc2', label: 'Description 2',    type: 'textarea', rows: 3 },
          { key: 'trust', label: 'Trust Badge Text', type: 'text' },
        ]
      },
      {
        key: 'faq', label: 'FAQ Accordion',
        fields: [
          { key: 'q1', label: 'Q1', type: 'text' }, { key: 'a1', label: 'A1', type: 'textarea', rows: 3 },
          { key: 'q2', label: 'Q2', type: 'text' }, { key: 'a2', label: 'A2', type: 'textarea', rows: 3 },
          { key: 'q3', label: 'Q3', type: 'text' }, { key: 'a3', label: 'A3', type: 'textarea', rows: 3 },
          { key: 'q4', label: 'Q4', type: 'text' }, { key: 'a4', label: 'A4', type: 'textarea', rows: 3 },
        ]
      },
      {
        key: 'banner1', label: 'Banner 1 — Why Modern Food (Image Left)',
        fields: [
          { key: 'image_url', label: 'Image URL', type: 'text', hint: 'Paste a full image URL, e.g. https://... Leave blank to hide image.' },
          { key: 'image_alt', label: 'Image Alt Text', type: 'text' },
          { key: 'title',     label: 'Section Title', type: 'text' },
          { key: 'body',      label: 'Body Text (use blank lines to separate paragraphs)', type: 'textarea', rows: 8 },
        ]
      },
      {
        key: 'banner2', label: 'Banner 2 — Nature\'s Gold Standard (Image Right)',
        fields: [
          { key: 'image_url', label: 'Image URL', type: 'text', hint: 'Paste a full image URL. Leave blank to hide image.' },
          { key: 'image_alt', label: 'Image Alt Text', type: 'text' },
          { key: 'title',     label: 'Section Title',  type: 'text' },
          { key: 'intro',     label: 'Intro Paragraph', type: 'textarea', rows: 3 },
          { key: 'body',      label: 'Body Paragraph',  type: 'textarea', rows: 3 },
          { key: 'bullet1',   label: 'Bullet 1',        type: 'text' },
          { key: 'bullet2',   label: 'Bullet 2',        type: 'text' },
          { key: 'bullet3',   label: 'Bullet 3',        type: 'text' },
          { key: 'tagline',   label: 'Closing Tagline', type: 'textarea', rows: 2 },
        ]
      },
      {
        key: 'below_fold', label: 'Multivitamin Section (Left Column)',
        fields: [
          { key: 'title2', label: 'Section Title', type: 'text' },
          { key: 'body2',  label: 'Intro Paragraph', type: 'textarea', rows: 3 },
          { key: 'body3',  label: 'Second Paragraph (100% bioavailable)', type: 'textarea', rows: 2 },
          { key: 'body4',  label: 'Third Paragraph', type: 'textarea', rows: 2 },
          { key: 'mv_p1',  label: 'Key Point 1', type: 'text' },
          { key: 'mv_p2',  label: 'Key Point 2', type: 'text' },
          { key: 'mv_p3',  label: 'Key Point 3', type: 'text' },
          { key: 'mv_p4',  label: 'Key Point 4', type: 'text' },
          { key: 'g1_title', label: 'Group 1 Heading', type: 'text' },
          { key: 'g1_b1', label: 'Group 1 Bullet 1', type: 'textarea', rows: 2 },
          { key: 'g1_b2', label: 'Group 1 Bullet 2', type: 'textarea', rows: 2 },
          { key: 'g2_title', label: 'Group 2 Heading', type: 'text' },
          { key: 'g2_b1', label: 'Group 2 Bullet 1', type: 'textarea', rows: 2 },
          { key: 'g2_b2', label: 'Group 2 Bullet 2', type: 'textarea', rows: 2 },
          { key: 'g3_title', label: 'Group 3 Heading', type: 'text' },
          { key: 'g3_b1', label: 'Group 3 Bullet 1', type: 'textarea', rows: 2 },
          { key: 'g3_b2', label: 'Group 3 Bullet 2', type: 'textarea', rows: 2 },
          { key: 'g3_b3', label: 'Group 3 Bullet 3', type: 'textarea', rows: 2 },
        ]
      },
      {
        key: 'infographic', label: 'Capsules Infographic (Arrows + Labels)',
        fields: [
          { key: 'image_url',    label: 'Center Image URL', type: 'text', hint: 'Use /images/capsules-bowl.svg or paste a direct image URL' },
          { key: 'image_alt',    label: 'Image Alt Text',   type: 'text' },
          { key: 'center_emoji', label: 'Center Emoji (fallback if no image)', type: 'text' },
          { key: 'top',          label: 'Top Label',         type: 'textarea', rows: 2 },
          { key: 'left',         label: 'Left Label',        type: 'textarea', rows: 2 },
          { key: 'right',        label: 'Right Label',       type: 'textarea', rows: 2 },
          { key: 'bottom_left',  label: 'Bottom-Left Label', type: 'textarea', rows: 2 },
          { key: 'bottom_right', label: 'Bottom-Right Label',type: 'textarea', rows: 2 },
          { key: 'brand',        label: 'Brand Name',        type: 'text' },
        ]
      },
      {
        key: 'nutrients', label: 'Nutrient Comparison',
        fields: [
          { key: 'title',    label: 'Section Title',    type: 'text' },
          { key: 'subtitle', label: 'Section Subtitle', type: 'text' },
        ]
      },
      {
        key: 'science', label: 'Science Stats',
        fields: [
          { key: 'title',      label: 'Title',         type: 'text' },
          { key: 'subtitle',   label: 'Subtitle',      type: 'text' },
          { key: 'stat1_pct',  label: 'Stat 1 %',      type: 'text' },
          { key: 'stat1_text', label: 'Stat 1 Text',   type: 'textarea', rows: 2 },
          { key: 'stat2_pct',  label: 'Stat 2 %',      type: 'text' },
          { key: 'stat2_text', label: 'Stat 2 Text',   type: 'textarea', rows: 2 },
          { key: 'stat3_pct',  label: 'Stat 3 %',      type: 'text' },
          { key: 'stat3_text', label: 'Stat 3 Text',   type: 'textarea', rows: 2 },
          { key: 'stat4_pct',  label: 'Stat 4 %',      type: 'text' },
          { key: 'stat4_text', label: 'Stat 4 Text',   type: 'textarea', rows: 2 },
          { key: 'tagline',    label: 'Bottom Tagline', type: 'textarea', rows: 2 },
        ]
      },
      {
        key: 'videos', label: 'Video Testimonials',
        fields: [
          { key: 'title',        label: 'Section Title', type: 'text' },
          { key: 'video1_url',   label: 'Video 1 URL (MP4)', type: 'text', hint: 'Local path e.g. /videos/16010072_1080_1920_30fps.mp4 or full https URL' },
          { key: 'video1_name',  label: 'Video 1 Name', type: 'text' },
          { key: 'video1_label', label: 'Video 1 Label', type: 'text' },
          { key: 'video2_url',   label: 'Video 2 URL (MP4)', type: 'text' },
          { key: 'video2_name',  label: 'Video 2 Name', type: 'text' },
          { key: 'video2_label', label: 'Video 2 Label', type: 'text' },
          { key: 'video3_url',   label: 'Video 3 URL (MP4)', type: 'text' },
          { key: 'video3_name',  label: 'Video 3 Name', type: 'text' },
          { key: 'video3_label', label: 'Video 3 Label', type: 'text' },
          { key: 'video4_url',   label: 'Video 4 URL (MP4)', type: 'text' },
          { key: 'video4_name',  label: 'Video 4 Name', type: 'text' },
          { key: 'video4_label', label: 'Video 4 Label', type: 'text' },
        ]
      },
      {
        key: 'reviews', label: 'Reviews Section',
        fields: [{ key: 'title', label: 'Section Title', type: 'textarea', rows: 2 }]
      },
    ]
  },
  {
    key: 'policy', label: 'Policy Pages', icon: 'file',
    sections: [
      {
        key: 'refund', label: 'Refund Policy',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'body',  label: 'Content (use **bold** for headings, blank line for paragraphs)', type: 'textarea', rows: 18 },
        ]
      },
      {
        key: 'privacy', label: 'Privacy Policy',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'body',  label: 'Content', type: 'textarea', rows: 18 },
        ]
      },
      {
        key: 'terms', label: 'Terms of Service',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'body',  label: 'Content', type: 'textarea', rows: 18 },
        ]
      },
      {
        key: 'shipping', label: 'Shipping Policy',
        fields: [
          { key: 'title', label: 'Page Title', type: 'text' },
          { key: 'body',  label: 'Content', type: 'textarea', rows: 18 },
        ]
      },
    ]
  },
];

function SectionEditor({ section, values, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="ac-section">
      <button className="ac-section-toggle" onClick={() => setOpen(o => !o)}>
        <span>{section.label}</span>
        <AdminIcon name={open ? 'chevronDown' : 'chevronRight'} size={16} className="ac-toggle-icon-svg" />
      </button>
      {open && (
        <div className="ac-section-fields">
          {section.fields.map(f => (
            <div key={f.key} className="ac-field">
              <label className="ac-label">
                {f.label}
                {f.hint && <span className="ac-hint"> — {f.hint}</span>}
              </label>
              <RichTextEditor
                rows={f.rows || (f.type === 'text' ? 2 : 3)}
                value={values[f.key] ?? ''}
                onChange={(v) => onChange(section.key, f.key, v)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminContent() {
  const [activePage, setActivePage] = useState(PAGES[0].key);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');

  const loadPage = useCallback(async (page) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BASE}/content/${page}`, { headers: hdrs() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
      }
      const rows = await res.json();
      if (!Array.isArray(rows)) throw new Error('Invalid response');
      const map = {};
      rows.forEach(r => { map[`${r.section}__${r.field}`] = r.value ?? ''; });
      setValues(map);
    } catch (e) {
      setError(e.message === 'Invalid response' || e.message?.startsWith('HTTP')
        ? 'Failed to load content. Is the API running?'
        : `Failed to load content: ${e.message}`);
      setValues({});
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadPage(activePage); }, [activePage, loadPage]);

  const handleChange = (section, field, val) => {
    setValues(v => ({ ...v, [`${section}__${field}`]: val }));
  };

  const getPageDef = () => PAGES.find(p => p.key === activePage);

  const handleSave = async () => {
    setSaving(true); setError('');
    const pageDef = getPageDef();
    const fields = [];
    pageDef.sections.forEach(sec => {
      sec.fields.forEach(f => {
        fields.push({ section: sec.key, field: f.key, value: values[`${sec.key}__${f.key}`] || '' });
      });
    });
    try {
      const res = await fetch(`${BASE}/content/${activePage}`, {
        method: 'PUT',
        headers: hdrs(),
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) throw new Error();
      invalidateContent(activePage);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError('Save failed. Are you logged in as admin?'); }
    setSaving(false);
  };

  const handleReset = async () => {
    if (!window.confirm(`Reset all ${getPageDef().label} content to defaults?`)) return;
    setResetting(true); setError('');
    try {
      const res = await fetch(`${BASE}/content/${activePage}/reset`, { method: 'POST', headers: hdrs() });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Reset failed');
      }
      const rows = await res.json();
      if (!Array.isArray(rows)) throw new Error('Invalid response');
      const map = {};
      rows.forEach(r => { map[`${r.section}__${r.field}`] = r.value ?? ''; });
      setValues(map);
      invalidateContent(activePage);
    } catch (e) {
      setError(e.message || 'Reset failed. Are you logged in as admin?');
    }
    setResetting(false);
  };

  const pageDef = getPageDef();

  return (
    <div className="admin-content-editor">
      <div className="admin-header">
        <div>
          <h1>Page Content Editor</h1>
          <p>Edit text and images for any page — changes go live instantly after saving</p>
        </div>
        <div className="ac-header-actions">
          <button className="ac-reset-btn" onClick={handleReset} disabled={resetting}>
            <AdminIcon name="reset" size={14} /> {resetting ? 'Resetting...' : 'Reset to Defaults'}
          </button>
          <button
            className="ac-save-btn"
            onClick={handleSave}
            disabled={saving}
            style={{ background: saved ? '#10b981' : '#F5C800', color: saved ? 'white' : '#111' }}
          >
            {saving ? 'Saving...' : saved ? <><AdminIcon name="check" size={14} /> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="ac-error">{error}</div>}

      <div className="ac-layout">
        <div className="ac-page-tabs">
          {PAGES.map(p => (
            <button
              key={p.key}
              className={`ac-page-tab ${activePage === p.key ? 'active' : ''}`}
              onClick={() => setActivePage(p.key)}
            >
              {p.icon && <AdminIcon name={p.icon} size={16} />}
              {p.label}
            </button>
          ))}
          <div className="ac-tip">
            <strong><AdminIcon name="tip" size={14} /> Tip</strong>
            <p>Use the formatting toolbar for bold, italic, lists, alignment, and more. Changes go live when you click <em>Save Changes</em>.</p>
          </div>
        </div>

        <div className="ac-editor-area">
          {loading ? (
            <div className="ac-loading">Loading content…</div>
          ) : (
            <>
              <div className="ac-page-title">{pageDef.label}</div>
              {pageDef.sections.map(sec => (
                <SectionEditor
                  key={sec.key}
                  section={sec}
                  values={Object.fromEntries(
                    Object.entries(values)
                      .filter(([k]) => k.startsWith(`${sec.key}__`))
                      .map(([k, v]) => [k.replace(`${sec.key}__`, ''), v])
                  )}
                  onChange={handleChange}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}