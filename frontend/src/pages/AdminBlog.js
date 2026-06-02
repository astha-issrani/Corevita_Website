import React, { useState, useEffect, useCallback } from 'react';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/admin/ImageUpload';
import { AdminIcon } from '../components/admin/AdminIcons';
import { stripMarkdown } from '../utils/renderRichText';
import './AdminBlog.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';
const token = () => localStorage.getItem('corevita_token');
const hdrs = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` });

const emptyForm = () => ({
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  coverImage: '/images/banner-modern-food.svg',
  author: 'CoreVita Team',
  published: true,
});

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/blog/admin/all`, { headers: hdrs() });
      if (!res.ok) throw new Error('Failed to load');
      setPosts(await res.json());
    } catch (e) {
      setError(e.message || 'Failed to load posts');
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startNew = () => {
    setEditing('new');
    setForm(emptyForm());
    setError('');
  };

  const startEdit = (post) => {
    setEditing(post._id);
    setForm({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      body: post.body || '',
      coverImage: post.coverImage || '',
      author: post.author || 'CoreVita Team',
      published: post.published !== false,
    });
    setError('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const isNew = editing === 'new';
      const url = isNew ? `${API}/blog/admin` : `${API}/blog/admin/${editing}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: hdrs(),
        body: JSON.stringify({
          ...form,
          title: stripMarkdown(form.title),
          slug: stripMarkdown(form.slug),
          author: stripMarkdown(form.author),
          excerpt: stripMarkdown(form.excerpt),
          coverImage: stripMarkdown(form.coverImage),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      cancelEdit();
      load();
    } catch (e) {
      setError(e.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article permanently?')) return;
    try {
      await fetch(`${API}/blog/admin/${id}`, { method: 'DELETE', headers: hdrs() });
      if (editing === id) cancelEdit();
      load();
    } catch {
      setError('Delete failed');
    }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="admin-blog">
      <div className="admin-header">
        <div>
          <h1>Blog Articles</h1>
          <p>Create and edit articles shown on the public blog at /blog</p>
        </div>
        <div className="ab-header-actions">
          {!editing && (
            <button type="button" className="refresh-btn" style={{ background: '#F5C800', color: '#111' }} onClick={startNew}>
              + New Article
            </button>
          )}
          <button type="button" className="refresh-btn" onClick={load}><AdminIcon name="refresh" size={14} /> Refresh</button>
        </div>
      </div>

      {error && <div className="ac-error">{error}</div>}

      {editing ? (
        <div className="ab-editor">
          <h2>{editing === 'new' ? 'New article' : 'Edit article'}</h2>
          <div className="ab-form">
            <div className="ac-field">
              <label className="ac-label">Title *</label>
              <RichTextEditor rows={2} value={form.title} onChange={(v) => set('title', v)} />
            </div>
            <div className="ac-field">
              <label className="ac-label">URL slug <span className="ac-hint">(auto from title if empty)</span></label>
              <RichTextEditor rows={1} value={form.slug} onChange={(v) => set('slug', v)} placeholder="my-article-title" />
            </div>
            <div className="ac-field">
              <label className="ac-label">Cover image</label>
              <ImageUpload
                value={form.coverImage}
                onChange={(v) => set('coverImage', v)}
                label="Upload cover image"
                hint="Shown on blog listing and article header"
              />
            </div>
            <div className="ac-field">
              <label className="ac-label">Author</label>
              <RichTextEditor rows={1} value={form.author} onChange={(v) => set('author', v)} />
            </div>
            <div className="ac-field">
              <label className="ac-label">Short excerpt (listing page)</label>
              <RichTextEditor rows={3} value={form.excerpt} onChange={(v) => set('excerpt', v)} />
            </div>
            <div className="ac-field">
              <label className="ac-label">Article body</label>
              <RichTextEditor rows={14} value={form.body} onChange={(v) => set('body', v)} />
            </div>
            <label className="ab-published">
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
              Published (visible on website)
            </label>
            <div className="ab-form-actions">
              <button type="button" className="ac-reset-btn" onClick={cancelEdit}>Cancel</button>
              <button
                type="button"
                className="ac-save-btn"
                onClick={handleSave}
                disabled={saving}
                style={{ background: saved ? '#10b981' : '#F5C800', color: saved ? '#fff' : '#111' }}
              >
                {saving ? 'Saving…' : saved ? <><AdminIcon name="check" size={14} /> Saved!</> : 'Save Article'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="ab-list-wrap">
          {loading ? (
            <p className="ab-loading">Loading articles…</p>
          ) : posts.length === 0 ? (
            <p className="ab-empty">No articles yet. Click &quot;New Article&quot; to create one, or restart the server to seed defaults.</p>
          ) : (
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p._id}>
                    <td><strong>{p.title}</strong></td>
                    <td><code className="ab-slug">/blog/{p.slug}</code></td>
                    <td>
                      <span className={`ab-status ${p.published ? 'on' : 'off'}`}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="ab-row-actions">
                        <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="ab-link-btn">View</a>
                        <button type="button" className="ab-edit-btn" onClick={() => startEdit(p)}>Edit</button>
                        <button type="button" className="ab-del-btn" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
