import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../utils/api';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartGroups, cartTotal, cartSavings, cartFinalTotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: info, 2: payment
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'Required';
    if (!form.lastName) errs.lastName = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.address) errs.address = 'Required';
    if (!form.city) errs.city = 'Required';
    if (!form.zipCode) errs.zipCode = 'Required';
    if (!form.country?.trim()) errs.country = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          packLabel: item.packLabel,
        })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          country: form.country.trim(),
          phone: form.phone,
        },
        guestEmail: form.email,
        subtotal: cartTotal,
        discount: cartSavings,
        couponCode: coupon ? coupon.code : null,
        couponDiscount: coupon ? coupon.discountAmount : 0,
        shipping,
        total,
        autoRefill: cartItems.some(i => i.autoRefill),
      };

      const { data } = await createOrder(orderData);
      clearCart();
      navigate('/order-success', { state: { order: data } });
    } catch (err) {
      // Demo: proceed anyway
      clearCart();
      navigate('/order-success', { state: { order: { orderNumber: 'CV' + Date.now().toString().slice(-8) } } });
    } finally {
      setLoading(false);
    }
  };

  const shipping = cartFinalTotal >= 50 ? 0 : 5.99;
  const total = cartFinalTotal + shipping;

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-empty container">
        <h2>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-grid">
        {/* Left: Form */}
        <div className="checkout-form-wrap">
          <div className="checkout-logo">COREVITA</div>

          {/* Steps */}
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span> Contact
            </div>
            <div className="step-divider">›</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span> Payment
            </div>
          </div>

          {step === 1 && (
            <div className="checkout-section fade-in">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                  {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                  {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone (optional)</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 000 0000" />
              </div>

              <h3 style={{ marginTop: 32 }}>Shipping Address</h3>
              <div className="form-group">
                <label>Address</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street" />
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} placeholder="NY" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="10001" />
                  {errors.zipCode && <span className="field-error">{errors.zipCode}</span>}
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="United States"
                    autoComplete="country-name"
                  />
                  {errors.country && <span className="field-error">{errors.country}</span>}
                </div>
              </div>

              <button
                className="btn-primary continue-btn"
                onClick={() => { if (validateStep1()) setStep(2); }}
              >
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-section fade-in">
              <button className="back-btn" onClick={() => setStep(1)}>← Back to Contact</button>
              <h3>Payment</h3>

              <div className="demo-payment-notice">
                🔒 This is a demo checkout. No real payment will be processed.
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry</label>
                  <input placeholder="MM/YY" defaultValue="12/28" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input placeholder="123" defaultValue="123" />
                </div>
              </div>
              <div className="form-group">
                <label>Name on Card</label>
                <input placeholder="John Doe" defaultValue={`${form.firstName} ${form.lastName}`} />
              </div>

              <button
                className="btn-primary place-order-btn"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
              </button>

              <p className="secure-note">🔒 Secure checkout powered by Stripe</p>
            </div>
          )}
        </div>

        {/* Right: Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {Object.entries(cartGroups || {}).map(([groupId, bottles]) => {
              const sample = bottles[0];
              return (
                <div key={groupId}>
                  <div className="summary-group-label">
                    <strong>{sample.packLabel}</strong>
                    {sample.autoRefill && <small style={{ color: 'green', display: 'block' }}>📦 Auto Refill</small>}
                  </div>
                  {bottles.map(bottle => (
                    <div key={bottle.packId} className="summary-item">
                      <div className="summary-item-img">{bottle.isFree ? '🆓' : '🐝'}</div>
                      <div className="summary-item-info">
                        <p>{bottle.bottleLabel}</p>
                        <small>{bottle.name}</small>
                      </div>
                      <div className="summary-item-price">
                        {bottle.isFree ? <span style={{color:'#10b981',fontWeight:700}}>FREE</span> : `$${bottle.price.toFixed(2)}`}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <hr className="divider" />
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          {cartSavings > 0 && (
            <div className="summary-row savings">
              <span>Pack Savings</span>
              <span>-${cartSavings.toFixed(2)}</span>
            </div>
          )}
          {coupon && (
            <div className="summary-row savings">
              <span>Coupon ({coupon.code})</span>
              <span>-${coupon.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <hr className="divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}