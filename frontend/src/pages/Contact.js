import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
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
        {
          name: form.name,
          email: form.email,
          subject: 'Contact form',
          message: `Phone: ${form.phone}\n\n${form.message}`,
        }
      );
      setSent(true);
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container contact-wrap">
        <h1 className="contact-title">Contact form</h1>

        {sent ? (
          <div className="contact-success fade-in">
            <h3>Message sent!</h3>
            <p>We&apos;ll get back to you within 24 hours.</p>
            <button
              type="button"
              className="contact-send-btn"
              onClick={() => {
                setSent(false);
                setForm({ name: '', email: '', phone: '', message: '' });
              }}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form-simple">
            <div className="contact-row">
              <div className="contact-field">
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="contact-field">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <div className="contact-field">
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="contact-field">
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Comment"
                rows={6}
                required
              />
            </div>
            {error && <p className="contact-error">{error}</p>}
            <button type="submit" className="contact-send-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
