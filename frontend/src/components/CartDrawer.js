import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/api$/, '');

export default function CartDrawer() {
  const {
    cartItems, isCartOpen, setIsCartOpen,
    removeFromCart, updateQuantity,
    cartTotal, cartSavings, cartFinalTotal,
    coupon, applyCoupon, removeCoupon,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 50;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await axios.post(`${API}/coupons/validate`, {
        code: couponInput.trim(),
        orderTotal: cartTotal,
      });
      applyCoupon(data);
      setCouponInput('');
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponError('');
    setCouponInput('');
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Cart • {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
          <div className="free-shipping-bar achieved">
            🎉 Congrats! You get FREE shipping!
          </div>
        ) : (
          <div className="free-shipping-bar">
            <div className="shipping-progress-wrap">
              <div className="shipping-progress" style={{ width: `${(cartTotal / FREE_SHIPPING_THRESHOLD) * 100}%` }} />
            </div>
            <p>Add <strong>${toFreeShipping.toFixed(2)}</strong> more for FREE shipping</p>
          </div>
        )}

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
             <Link to="/products/bee-pearl" onClick={() => setIsCartOpen(false)} className="btn-primary" style={{ display: 'inline-block', marginTop: 16 }}>
  Shop Now
</Link>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.packId} className="cart-item">
                <div className="cart-item-img">
                  <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
                    <rect x="10" y="14" width="60" height="82" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1.5"/>
                    <rect x="14" y="4" width="52" height="14" rx="5" fill="#BBBBBB"/>
                    <rect x="10" y="38" width="60" height="52" fill="#F5C800"/>
                    <ellipse cx="40" cy="56" rx="8" ry="5" fill="#333"/>
                    <ellipse cx="40" cy="56" rx="4" ry="5" fill="#F5C800"/>
                    <ellipse cx="36" cy="52" rx="5" ry="3" fill="rgba(255,255,255,0.55)" transform="rotate(-30 36 52)"/>
                    <ellipse cx="44" cy="52" rx="5" ry="3" fill="rgba(255,255,255,0.55)" transform="rotate(30 44 52)"/>
                    <text x="40" y="72" textAnchor="middle" fontFamily="Arial" fontSize="7" fontWeight="900" fill="#333">BEE PEARL</text>
                    <text x="40" y="82" textAnchor="middle" fontFamily="Arial" fontSize="4.5" fill="#555">DIETARY SUPPLEMENT</text>
                  </svg>
                </div>
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-pack">{item.packLabel}</p>
                  {item.autoRefill && <p className="cart-item-refill">📦 Auto Refill Monthly</p>}
                  <div className="cart-item-price-row">
                    {item.originalPrice > item.price && (
                      <span className="cart-item-original">${(item.originalPrice * item.quantity).toFixed(2)}</span>
                    )}
                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="cart-item-savings">(You save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)})</span>
                    )}
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(item.packId, -1)}>−</button>
                    <span className="cart-qty-bottles">
                      {item.quantity} <small>bottles</small>
                    </span>
                    <button onClick={() => updateQuantity(item.packId, 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.packId)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">

            {/* ── Coupon Section ── */}
            <div className="coupon-section">
              {coupon ? (
                <div className="coupon-applied">
                  <span>🏷️ <strong>{coupon.code}</strong> — {coupon.message}</span>
                  <button className="coupon-remove-btn" onClick={handleRemoveCoupon}>✕</button>
                </div>
              ) : (
                <div className="coupon-input-row">
                  <input
                    className="coupon-input"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button
                    className="coupon-apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponError && <p className="coupon-error">{couponError}</p>}
            </div>

            {/* ── Totals ── */}
            {cartSavings > 0 && (
              <div className="cart-savings-row">
                <span>Pack Savings</span>
                <span className="savings-amt">-${cartSavings.toFixed(2)}</span>
              </div>
            )}
            {coupon && (
              <div className="cart-savings-row coupon-savings-row">
                <span>Coupon ({coupon.code})</span>
                <span className="savings-amt">-${coupon.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${cartFinalTotal.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              className="btn-primary checkout-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Checkout
            </Link>
            <div className="cart-payment-icons">
              <span>💳</span> <span>Apple Pay</span> <span>Google Pay</span> <span>Visa</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}