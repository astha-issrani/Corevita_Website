import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="topbar">
        ⚡ FREE US SHIPPING ON ALL ORDERS $50+
      </div>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-logo">COREVITA</Link>
          <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
           
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link to="/track-order" onClick={() => setMenuOpen(false)}>Track Your Order</Link>
          </div>
          <div className="navbar-actions">
            <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}