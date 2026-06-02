import React, { useState, useEffect, useCallback } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/admin/ImageUpload';
import { AdminIcon } from '../components/admin/AdminIcons';
import { stripMarkdown } from '../utils/renderRichText';
import './AdminContent.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';
const SLUG = 'bee-pearl';
const token = () => localStorage.getItem('corevita_token');
const hdrs = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

export default function AdminProduct() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    savingsPercent: '',
    stockLeft: '',
    imagesText: '',
    benefitsText: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/products/${SLUG}`);
      if (!res.ok) throw new Error('Failed to load product');
      const p = await res.json();
      setForm({
        name: p.name || '',
        price: String(p.price ?? ''),
        originalPrice: String(p.originalPrice ?? ''),
        savingsPercent: String(p.savingsPercent ?? ''),
        stockLeft: String(p.stockLeft ?? ''),
        imagesText: (p.images || []).filter(Boolean).join('\n'),
        benefitsText: (p.benefits || []).join('\n'),
      });
    } catch (e) {
      setError(e.message || 'Failed to load product');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API}/products/${SLUG}`, {
        method: 'PUT',
        headers: hdrs(),
        body: JSON.stringify({
          name: stripMarkdown(form.name),
          price: parseFloat(form.price) || 0,
          originalPrice: parseFloat(form.originalPrice) || 0,
          savingsPercent: parseInt(form.savingsPercent, 10) || 0,
          stockLeft: parseInt(form.stockLeft, 10) || 0,
          images: form.imagesText.split('\n').map(s => stripMarkdown(s.trim())).filter(Boolean),
          benefits: form.benefitsText.split('\n').map(s => stripMarkdown(s.trim())).filter(Boolean),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message || 'Save failed. Are you logged in as admin?');
    }
    setSaving(false);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="admin-content-editor">
      <div className="admin-header">
        <div>
          <h1>Product Settings</h1>
          <p>Edit the product name, gallery images, pricing, and benefit bullets shown on the product page</p>
        </div>
        <button
          className="ac-save-btn"
          onClick={handleSave}
          disabled={saving || loading}
          style={{ background: saved ? '#10b981' : undefined, color: saved ? 'white' : undefined }}
        >
          {saving ? 'Saving...' : saved ? <><AdminIcon name="check" size={14} /> Saved!</> : 'Save Product'}
        </button>
      </div>

      {error && <div className="ac-error">{error}</div>}

      {loading ? (
        <div className="ac-loading">Loading product…</div>
      ) : (
        <div className="ac-editor-area" style={{ maxWidth: 720 }}>
          <div className="ac-section">
            <div className="ac-section-fields">
              <div className="ac-field">
                <label className="ac-label">Product name</label>
                <RichTextEditor rows={2} value={form.name} onChange={v => set('name', v)} />
              </div>
              <div className="ac-field ac-price-grid">
                <div>
                  <label className="ac-label">Price ($)</label>
                  <input className="ac-input" value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
                <div>
                  <label className="ac-label">Was ($)</label>
                  <input className="ac-input" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} />
                </div>
                <div>
                  <label className="ac-label">Save %</label>
                  <input className="ac-input" value={form.savingsPercent} onChange={e => set('savingsPercent', e.target.value)} />
                </div>
                <div>
                  <label className="ac-label">Stock left</label>
                  <input className="ac-input" value={form.stockLeft} onChange={e => set('stockLeft', e.target.value)} />
                </div>
              </div>
              <div className="ac-field">
                <label className="ac-label">
                  Product images
                  <span className="ac-hint"> — upload or add one image per line</span>
                </label>
                <ImageUpload
                  multiple
                  value={form.imagesText}
                  onChange={v => set('imagesText', v)}
                  label="Upload product images"
                  hint="Add multiple images for the gallery"
                />
              </div>
              <div className="ac-field">
                <label className="ac-label">Benefit bullets (one per line)</label>
                <RichTextEditor rows={5} value={form.benefitsText} onChange={v => set('benefitsText', v)} />
              </div>
            </div>
          </div>
          <div className="ac-tip">
            <strong><AdminIcon name="tip" size={14} /> Tip</strong>
            <p>Page Content → Product Hero still overrides the headline and descriptions. Product name here updates the cart, sticky bar, and default title when Page Content title is empty.</p>
          </div>
        </div>
      )}
    </div>
  );
}
