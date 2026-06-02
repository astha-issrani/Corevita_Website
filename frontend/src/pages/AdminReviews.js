import React, { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { AdminIcon } from '../components/admin/AdminIcons';
import './AdminReviews.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

function StarDisplay({ rating }) {
  return (
    <span className="ar-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill={i < rating ? '#E6B800' : 'none'} stroke={i < rating ? '#E6B800' : '#ccc'} />
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // ✅ FIX: read token fresh inside each function, not at render time
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('corevita_token');
      const res = await fetch(`${API}/api/products/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        console.error('Reviews fetch failed:', res.status, res.statusText);
        setReviews([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Reviews fetch error:', err);
      setReviews([]);
    }
    setLoading(false);
  }, []); // ✅ empty deps — no stale token capture

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleApprove = async (id, approved) => {
    const token = localStorage.getItem('corevita_token'); // ✅ fresh token
    await fetch(`${API}/api/products/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ approved }),
    });
    fetchReviews();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    const token = localStorage.getItem('corevita_token'); // ✅ fresh token
    await fetch(`${API}/api/products/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchReviews();
  };

  const filtered = reviews
    .filter(r => filter === 'all' ? true : filter === 'pending' ? !r.approved : r.approved)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.body.toLowerCase().includes(search.toLowerCase()));

  const pending = reviews.filter(r => !r.approved).length;

  return (
    <div className="admin-reviews">
      <div className="ar-header">
        <div>
          <h2>Customer Reviews</h2>
          <p>{reviews.length} total · <span className="ar-pending-count">{pending} pending approval</span></p>
        </div>
        <button className="ar-refresh-btn" onClick={fetchReviews}><AdminIcon name="refresh" size={14} /> Refresh</button>
      </div>

      {/* Stats */}
      <div className="ar-stats">
        {[
          { label: 'Total', value: reviews.length, color: '#333' },
          { label: 'Pending', value: pending, color: '#f59e0b' },
          { label: 'Approved', value: reviews.filter(r => r.approved).length, color: '#10b981' },
          { label: 'Avg Rating', value: reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '—', color: '#E6B800' },
        ].map((s, i) => (
          <div key={i} className="ar-stat-card">
            <div className="ar-stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="ar-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ar-filters">
        <div className="ar-filter-tabs">
          {['all', 'pending', 'approved'].map(f => (
            <button key={f} className={`ar-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'pending' && pending > 0 && <span className="ar-badge">{pending}</span>}
            </button>
          ))}
        </div>
        <input
          className="ar-search"
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="ar-loading">Loading reviews...</div>
      ) : filtered.length === 0 ? (
        <div className="ar-empty">No reviews found.</div>
      ) : (
        <div className="ar-table-wrapper">
          <table className="ar-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Product</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id} className={!r.approved ? 'ar-row-pending' : ''}>
                  <td data-label="Customer">
                    <div className="ar-customer">
                      <div className="ar-avatar">{r.name[0].toUpperCase()}</div>
                      <div>
                        <strong>{r.name}</strong>
                        {r.email && <small>{r.email}</small>}
                      </div>
                    </div>
                  </td>
                  <td data-label="Rating"><StarDisplay rating={r.rating} /></td>
                  <td data-label="Review">
                    <div className="ar-review-text">
                      {r.title && <strong className="ar-review-title">"{r.title}"</strong>}
                      <p>{r.body.length > 120 ? r.body.slice(0, 120) + '...' : r.body}</p>
                    </div>
                  </td>
                  <td data-label="Product"><span className="ar-slug">{r.productSlug}</span></td>
                  <td data-label="Date"><span className="ar-date">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></td>
                  <td data-label="Status">
                    <span className={`ar-status ${r.approved ? 'approved' : 'pending'}`}>
                      {r.approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="ar-actions">
                      {!r.approved ? (
                        <button className="ar-btn approve" onClick={() => handleApprove(r._id, true)}>Approve</button>
                      ) : (
                        <button className="ar-btn unapprove" onClick={() => handleApprove(r._id, false)}>Unpublish</button>
                      )}
                      <button className="ar-btn delete" onClick={() => handleDelete(r._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}