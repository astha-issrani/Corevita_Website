import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="success-page container">
      <div className="success-card fade-in">
        <div className="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        {order?.orderNumber && (
          <p className="order-num">Order #{order.orderNumber}</p>
        )}
        <p className="success-msg">
          Thank you for your purchase! You'll receive an email confirmation shortly.
          Your CoreVita Bee Pearl will be delivered in 5–8 business days.
        </p>

        <div className="success-steps">
          <div className="success-step active">
            <div className="step-dot">✓</div>
            <div>
              <strong>Order Placed</strong>
              <p>Your order has been received</p>
            </div>
          </div>
          <div className="step-line" />
          <div className="success-step">
            <div className="step-dot">2</div>
            <div>
              <strong>Processing</strong>
              <p>We're preparing your order</p>
            </div>
          </div>
          <div className="step-line" />
          <div className="success-step">
            <div className="step-dot">3</div>
            <div>
              <strong>Shipped</strong>
              <p>On its way to you</p>
            </div>
          </div>
          <div className="step-line" />
          <div className="success-step">
            <div className="step-dot">4</div>
            <div>
              <strong>Delivered</strong>
              <p>Enjoy your CoreVita!</p>
            </div>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/track-order" className="btn-primary">Track Your Order</Link>
         <Link to="/products/bee-pearl" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
