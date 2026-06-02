import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const API = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '') + '/api';

const PAYMENT_METHODS = ['Amex', 'Apple Pay', 'Discover', 'G Pay', 'Mastercard', 'Shop Pay', 'Visa'];

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function BottleSVG() {
  return (
    <svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" width="56" height="56" aria-hidden="true">
      <rect x="10" y="14" width="60" height="82" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
      <rect x="14" y="4" width="52" height="14" rx="5" fill="#BBBBBB" />
      <rect x="10" y="38" width="60" height="52" fill="#111111" />
      <ellipse cx="40" cy="56" rx="8" ry="5" fill="#333" />
      <ellipse cx="40" cy="56" rx="4" ry="5" fill="#111111" />
      <text x="40" y="72" textAnchor="middle" fontFamily="Arial" fontSize="7" fontWeight="900" fill="#ffffff">BEE PEARL</text>
    </svg>
  );
}

export default function CartDrawer() {
  const {
    cartItems, cartGroups, isCartOpen, setIsCartOpen,
    removeGroup, updateQuantity,
    cartTotal, cartSavings, cartFinalTotal,
    coupon, applyCoupon, removeCoupon,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 50;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const shippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;

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

  const groupIds = Object.keys(cartGroups).filter((groupId) => {
    const bottles = cartGroups[groupId];
    const packSize = Number(bottles[0]?.packSize || 1);
    return packSize > 0 && bottles.length >= packSize && bottles.length % packSize === 0;
  });
  const totalItems = groupIds.reduce((sum, groupId) => {
    const bottles = cartGroups[groupId];
    return sum + bottles.length / Number(bottles[0]?.packSize || 1);
  }, 0);
  const totalSavings = cartSavings + (coupon?.discountAmount || 0);

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)} />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>

        <div className="cart-header">
          <h3>Cart • {totalItems} item{totalItems !== 1 ? 's' : ''}</h3>
          <button type="button" className="cart-close" onClick={() => setIsCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        {groupIds.length > 0 && (
          <div className="cart-shipping-section">
            {hasFreeShipping ? (
              <p className="cart-shipping-msg">Congrats! You get FREE shipping!</p>
            ) : (
              <p className="cart-shipping-msg">
                Add <strong>${toFreeShipping.toFixed(2)}</strong> more for FREE shipping
              </p>
            )}
            <div className="cart-shipping-bar-wrap">
              <div
                className="cart-shipping-bar-fill"
                style={{ width: hasFreeShipping ? '100%' : `${shippingProgress}%` }}
              />
              <span className="cart-shipping-truck" aria-hidden="true">
                <TruckIcon />
              </span>
            </div>
          </div>
        )}

        <div className="cart-items">
          {groupIds.length === 0 ? (
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <Link to="/products/bee-pearl" onClick={() => setIsCartOpen(false)} className="cart-shop-btn">
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
              const packSave = Math.max(0, packOriginal - packTotal);

              return (
                <div key={groupId} className="cart-line">
                  <div className="cart-line-thumb">
                    <BottleSVG />
                  </div>

                  <div className="cart-line-body">
                    <strong className="cart-line-title">{sample.name}</strong>
                    <span className="cart-line-sub">
                      {sample.autoRefill ? 'Save More with Automatic Refills' : sample.packLabel}
                    </span>

                    <div className="cart-line-actions">
                      <div className="cart-qty-box">
                        <button type="button" onClick={() => updateQuantity(groupId, -1)} aria-label="Decrease quantity">−</button>
                        <span>{packCount}</span>
                        <button type="button" onClick={() => updateQuantity(groupId, 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button type="button" className="cart-remove-btn" onClick={() => removeGroup(groupId)} aria-label="Remove item">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>

                  <div className="cart-line-pricing">
                    {packOriginal > packTotal && (
                      <span className="cart-price-was">${packOriginal.toFixed(2)}</span>
                    )}
                    <span className="cart-price-now">${packTotal.toFixed(2)}</span>
                    {packSave > 0 && (
                      <span className="cart-price-save">(You save ${packSave.toFixed(2)})</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {groupIds.length > 0 && (
          <div className="cart-footer">
            <div className="coupon-section">
              {coupon ? (
                <div className="coupon-applied">
                  <span><strong>{coupon.code}</strong> — {coupon.message}</span>
                  <button type="button" className="coupon-remove-btn" onClick={handleRemoveCoupon}>✕</button>
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
                    type="button"
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

            {totalSavings > 0 && (
              <div className="cart-total-row cart-savings-row">
                <span>Savings</span>
                <span>-${totalSavings.toFixed(2)}</span>
              </div>
            )}
            <div className="cart-total-row cart-subtotal-row">
              <span>Subtotal</span>
              <span>${cartFinalTotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="checkout-btn" onClick={() => setIsCartOpen(false)}>
              Check out
            </Link>

            <div className="cart-payment-icons">
              {PAYMENT_METHODS.map(method => (
                <span key={method} className="cart-payment-pill">{method}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
