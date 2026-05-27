import React, { useState } from 'react';
import { trackOrder } from '../utils/api';
import './TrackOrder.css';

export default function TrackOrder() {
  const [form, setForm] = useState({ orderNumber: '', email: '' });
  const [trackingNum, setTrackingNum] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('order'); // 'order' | 'tracking'

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const payload = mode === 'order'
        ? { orderNumber: form.orderNumber, email: form.email }
        : { trackingNumber: trackingNum };
      const { data } = await trackOrder(payload);
      setOrder(data);
    } catch {
      setError('Order not found. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusSteps = ['processing', 'shipped', 'out_for_delivery', 'delivered'];
  const statusLabels = { processing: 'Processing', shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' };

  return (
    <div className="track-page container">
      <h1>Track Your Order</h1>

      <div className="track-card">
        <div className="track-tabs">
          <button
            className={`track-tab ${mode === 'order' ? 'active' : ''}`}
            onClick={() => setMode('order')}
          >
            Order Number + Email
          </button>
          <span className="track-or">Or</span>
          <button
            className={`track-tab ${mode === 'tracking' ? 'active' : ''}`}
            onClick={() => setMode('tracking')}
          >
            Tracking Number
          </button>
        </div>

        <form onSubmit={handleTrack} className="track-form">
          {mode === 'order' ? (
            <>
              <div className="form-group">
                <label>Order Number</label>
                <input
                  value={form.orderNumber}
                  onChange={e => setForm({ ...form, orderNumber: e.target.value })}
                  placeholder="e.g. CV12345678"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email or Phone Number</label>
                <input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Tracking Number</label>
              <input
                value={trackingNum}
                onChange={e => setTrackingNum(e.target.value)}
                placeholder="Enter tracking number"
                required
              />
            </div>
          )}

          <button type="submit" className="btn-primary track-btn" disabled={loading}>
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>

        {error && <p className="track-error">{error}</p>}

        {order && (
          <div className="track-result fade-in">
            <h3>Order #{order.orderNumber}</h3>
            <p className="track-status-label">Status: <strong>{statusLabels[order.orderStatus] || order.orderStatus}</strong></p>

            <div className="track-progress">
              {statusSteps.map((step, i) => {
                const currentIdx = statusSteps.indexOf(order.orderStatus);
                const isComplete = i <= currentIdx;
                return (
                  <React.Fragment key={step}>
                    <div className={`track-step ${isComplete ? 'complete' : ''}`}>
                      <div className="track-dot">{isComplete ? '✓' : i + 1}</div>
                      <span>{statusLabels[step]}</span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`track-line ${i < currentIdx ? 'complete' : ''}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {order.trackingNumber && (
              <p className="tracking-number">Tracking Number: <strong>{order.trackingNumber}</strong></p>
            )}
          </div>
        )}
      </div>

      <p className="track-powered">Powered by ParcelPanel</p>
    </div>
  );
}
