import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

export default function CartDrawer() {
  const {
    cartItems, cartGroups, isCartOpen, setIsCartOpen,
    removeGroup, updateQuantity,
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
        code: couponInput.trim().toUpperCase(),
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

  const handleRemoveCoupon = () => { removeCoupon(); setCouponError(''); setCouponInput(''); };

  const groupIds = Object.keys(cartGroups);
  const totalBottles = cartItems.length;

  const BottleSVG = () => (
    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" width="52" height="52">
      <rect x="10" y="14" width="60" height="82" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1.5"/>
      <rect x="14" y="4" width="52" height="14" rx="5" fill="#BBBBBB"/>
      <rect x="10" y="38" width="60" height="52" fill="#F5C800"/>
      <ellipse cx="40" cy="56" rx="8" ry="5" fill="#333"/>
      <ellipse cx="40" cy="56" rx="4" ry="5" fill="#F5C800"/>
      <text x="40" y="72" textAnchor="middle" fontFamily="Arial" fontSize="7" fontWeight="900" fill="#333">BEE PEARL</text>
    </svg>
  );

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>

        {/* Header */}
        <div className="cart-header">
          <h3>Cart • {totalBottles} bottle{totalBottles !== 1 ? 's' : ''}</h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {/* Free shipping bar */}
        {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
          <div className="free-shipping-bar achieved">🎉 Congrats! You get FREE shipping!</div>
        ) : (
          <div className="free-shipping-bar">
            <div className="shipping-progress-wrap">
              <div className="shipping-progress" style={{ width: `${Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} />
            </div>
            <p>Add <strong>${toFreeShipping.toFixed(2)}</strong> more for FREE shipping</p>
          </div>
        )}

        {/* Items */}
        <div className="cart-items">
          {groupIds.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <Link to="/products/bee-pearl" onClick={() => setIsCartOpen(false)} className="btn-primary" style={{ display: 'inline-block', marginTop: 16 }}>
                Shop Now
              </Link>
            </div>
          ) : (
            groupIds.map(groupId => {
              const bottles = cartGroups[groupId];
              const sample = bottles[0];
              const packCount = bottles.length / sample.packSize;
              const packTotal = cartItems
                .filter(i => i.groupId === groupId)
                .reduce((s, i) => s + i.price, 0);
              const packOriginal = cartItems
                .filter(i => i.groupId === groupId)
                .reduce((s, i) => s + i.originalPrice, 0);

              return (
                <div key={groupId} className="cart-group">
                  {/* Pack header */}
                  <div className="cart-group-header">
                    <div className="cart-group-title">
                      <strong>{sample.name}</strong>
                      <span className="cart-group-pack-label">{sample.packLabel}</span>
                      {sample.autoRefill && <span className="cart-item-refill">📦 Auto Refill Monthly</span>}
                    </div>
                    <div className="cart-group-controls">
                      <div className="cart-pack-qty">
                        <button onClick={() => updateQuantity(groupId, -1)}>−</button>
                        <span>{packCount} pack{packCount !== 1 ? 's' : ''}</span>
                        <button onClick={() => updateQuantity(groupId, 1)}>+</button>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeGroup(groupId)}>🗑</button>
                    </div>
                  </div>

                  {/* Individual bottle rows */}
                  <div className="cart-bottle-rows">
                    {bottles.map((bottle, idx) => (
                      <div key={bottle.packId} className={`cart-bottle-row ${bottle.isFree ? 'free-bottle' : ''}`}>
                        <div className="cart-bottle-img">
                          <BottleSVG />
                          {bottle.isFree && <span className="free-tag">FREE</span>}
                        </div>
                        <div className="cart-bottle-info">
                          <span className="cart-bottle-label">{bottle.bottleLabel}</span>
                          <span className="cart-bottle-sublabel">{sample.name}</span>
                        </div>
                        <div className="cart-bottle-price">
                          {bottle.isFree ? (
                            <>
                              <span className="bottle-original-price">${bottle.originalPrice.toFixed(2)}</span>
                              <span className="bottle-free-price">FREE</span>
                            </>
                          ) : (
                            <span className="bottle-paid-price">${bottle.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pack subtotal */}
                  <div className="cart-group-subtotal">
                    <span>Pack total</span>
                    <div className="cart-group-subtotal-prices">
                      {packOriginal > packTotal && (
                        <span className="cart-group-original">${packOriginal.toFixed(2)}</span>
                      )}
                      <span className="cart-group-final">${packTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {groupIds.length > 0 && (
          <div className="cart-footer">
            {/* Coupon */}
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
                    placeholder="COUPON CODE"
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

            {/* Totals */}
            {cartSavings > 0 && (
              <div className="cart-savings-row">
                <span>Pack Savings</span>
                <span className="savings-amt">-${cartSavings.toFixed(2)}</span>
              </div>
            )}
            {coupon && (
              <div className="cart-savings-row">
                <span>Coupon ({coupon.code})</span>
                <span className="savings-amt">-${coupon.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>${cartFinalTotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn-primary checkout-btn" onClick={() => setIsCartOpen(false)}>
              Checkout
            </Link>
            <div className="cart-payment-icons">
              <span>💳</span><span>Apple Pay</span><span>Google Pay</span><span>Visa</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}