import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeEmail } from '../utils/api';
import './Footer.css';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await subscribeEmail(email);
      setSubscribed(true);
      setEmail('');
    } catch { setSubscribed(true); }
  };

  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">COREVITA</span>
        </div>
        <div className="footer-links">
          <h4>Quick links</h4>
          <Link to="/products/bee-pearl">Shop CoreVita</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/track-order">Track Your Order</Link>
          <Link to="/contact">Manage Subscription</Link>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/contact">Contact Information</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
        </div>
        <div className="footer-subscribe">
          <h4>Subscribe to our emails</h4>
          <p>Join our email list for exclusive offers and the latest news.</p>
          {subscribed ? (
            <p className="subscribed-msg">✓ You're subscribed!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="subscribe-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit">Sign up</button>
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="payment-icons">
          <span>AMEX</span>
          <span>Apple Pay</span>
          <span>Diners</span>
          <span>Discover</span>
          <span>Google Pay</span>
          <span>JCB</span>
          <span>Mastercard</span>
          <span>PayPal</span>
          <span>Venmo</span>
          <span>Visa</span>
        </div>
        <p>© 2024, Corevita Powered by Shrine</p>
      </div>
    </footer>
  );
}
