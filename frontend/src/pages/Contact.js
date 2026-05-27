import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/contact`,
        form
      );
      setSent(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We're here to help! Reach out and we'll get back to you within 24 hours.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-info-item">
            <div className="info-icon">📧</div>
            <div>
              <h4>Email</h4>
              <p>support@corevita.com</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="info-icon">⏰</div>
            <div>
              <h4>Response Time</h4>
              <p>Within 24 hours</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="info-icon">📦</div>
            <div>
              <h4>Order Issues</h4>
              <p>Have your order number ready for faster support</p>
            </div>
          </div>
          <div className="contact-info-item">
            <div className="info-icon">🔄</div>
            <div>
              <h4>Returns & Refunds</h4>
              <p>30-day money back guarantee</p>
            </div>
          </div>
        </div>

        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success fade-in">
              <div className="success-icon-sm">✓</div>
              <h3>Message Sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button className="btn-primary" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <h3>Send us a Message</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                  <option value="">Select a topic</option>
                  <option value="order">Order Status</option>
                  <option value="return">Return / Refund</option>
                  <option value="product">Product Question</option>
                  <option value="subscription">Subscription</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={5}
                  required
                />
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn-primary submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}