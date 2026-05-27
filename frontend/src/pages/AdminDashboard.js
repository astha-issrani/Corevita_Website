import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('corevita_token');
}

const SUBJECT_LABELS = {
  order: 'Order Status',
  return: 'Return / Refund',
  product: 'Product Question',
  subscription: 'Subscription',
  other: 'Other',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [search, setSearch] = useState('');

  const admin = JSON.parse(localStorage.getItem('corevita_admin') || '{}');

  useEffect(() => {
    if (!getToken() || !admin.isAdmin) {
      navigate('/admin');
      return;
    }
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/contact`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessages(data);
    } catch {
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.patch(`${API}/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
      if (selected?._id === id) setSelected(prev => ({ ...prev, read: true }));
    } catch {}
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${API}/contact/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {}
  };

  const handleSelect = (msg) => {
    setSelected(msg);
    if (!msg.read) markRead(msg._id);
  };

  const handleLogout = () => {
    localStorage.removeItem('corevita_token');
    localStorage.removeItem('corevita_admin');
    navigate('/admin');
  };

  const filtered = messages.filter(m => {
    const matchFilter = filter === 'all' || (filter === 'unread' && !m.read) || (filter === 'read' && m.read);
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">COREVITA</div>
        <nav className="admin-nav">
          <div className="admin-nav-item active">
            <span>✉️</span> Messages
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </div>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">A</div>
            <div>
              <p>{admin.email}</p>
              <small>Administrator</small>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>Contact Messages</h1>
            <p>{messages.length} total · {unreadCount} unread</p>
          </div>
          <button className="refresh-btn" onClick={fetchMessages}>↻ Refresh</button>
        </div>

        {/* Filters + Search */}
        <div className="admin-toolbar">
          <div className="filter-tabs">
            {['all', 'unread', 'read'].map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
              </button>
            ))}
          </div>
          <input
            className="admin-search"
            placeholder="🔍 Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-content">
          {/* Message List */}
          <div className="message-list">
            {loading ? (
              <div className="admin-loading">Loading messages...</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty">
                <span>📭</span>
                <p>No messages found</p>
              </div>
            ) : (
              filtered.map(msg => (
                <div
                  key={msg._id}
                  className={`message-item ${!msg.read ? 'unread' : ''} ${selected?._id === msg._id ? 'active' : ''}`}
                  onClick={() => handleSelect(msg)}
                >
                  <div className="message-item-top">
                    <div className="message-sender">
                      <div className="sender-avatar">{msg.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="sender-name">{msg.name}</p>
                        <p className="sender-email">{msg.email}</p>
                      </div>
                    </div>
                    <div className="message-meta">
                      <span className="message-date">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {!msg.read && <span className="unread-dot" />}
                    </div>
                  </div>
                  <p className="message-subject">{SUBJECT_LABELS[msg.subject] || msg.subject}</p>
                  <p className="message-preview">{msg.message.slice(0, 80)}{msg.message.length > 80 ? '...' : ''}</p>
                </div>
              ))
            )}
          </div>

          {/* Message Detail */}
          <div className="message-detail">
            {selected ? (
              <div className="fade-in">
                <div className="detail-header">
                  <div className="detail-sender-info">
                    <div className="detail-avatar">{selected.name.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3>{selected.name}</h3>
                      <a href={`mailto:${selected.email}`} className="detail-email">{selected.email}</a>
                    </div>
                  </div>
                  <div className="detail-actions">
                    <a href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] || selected.subject}`}
                      className="btn-primary reply-btn">
                      ↩ Reply
                    </a>
                    <button className="delete-btn" onClick={() => deleteMessage(selected._id)}>🗑 Delete</button>
                  </div>
                </div>

                <div className="detail-meta">
                  <span className="detail-tag">{SUBJECT_LABELS[selected.subject] || selected.subject}</span>
                  <span className="detail-time">
                    {new Date(selected.createdAt).toLocaleString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                  <span className={`detail-status ${selected.read ? 'read' : 'unread'}`}>
                    {selected.read ? '✓ Read' : '● Unread'}
                  </span>
                </div>

                <div className="detail-body">
                  <p>{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="detail-empty">
                <span>📨</span>
                <p>Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}