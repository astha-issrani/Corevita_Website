import React from 'react';
import './PolicyPages.css';

export function RefundPolicy() {
  return (
    <div className="policy-page container">
      <h1>Refund Policy</h1>
      <div className="policy-content">
        <h2>30-Day Money Back Guarantee</h2>
        <p>We stand behind our products 100%. If you're not completely satisfied with CoreVita Bee Pearl within 30 days of purchase, we'll give you a full refund — no questions asked.</p>

        <h2>How to Request a Refund</h2>
        <p>To initiate a return or refund:</p>
        <ol>
          <li>Contact our support team at support@corevita.com</li>
          <li>Include your order number and reason for return</li>
          <li>We'll respond within 24 hours with return instructions</li>
        </ol>

        <h2>Refund Processing</h2>
        <p>Once we receive your return, refunds are processed within 5–7 business days to your original payment method.</p>

        <h2>Non-Refundable Items</h2>
        <p>Items that have been opened and used for more than 30 days are not eligible for a refund. Shipping costs are non-refundable.</p>

        <h2>Damaged or Defective Products</h2>
        <p>If you receive a damaged or defective product, contact us immediately with photos and we'll send a replacement at no cost.</p>
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <div className="policy-page container">
      <h1>Privacy Policy</h1>
      <div className="policy-content">
        <p><em>Last updated: January 2026</em></p>
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you make a purchase.</p>

        <h2>How We Use Your Information</h2>
        <p>We use your information to: process transactions, send order confirmations and updates, respond to your requests, and send marketing communications (with your consent).</p>

        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website (like payment processors and shipping partners).</p>

        <h2>Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this privacy policy, please contact us at privacy@corevita.com.</p>
      </div>
    </div>
  );
}

export function TermsOfService() {
  return (
    <div className="policy-page container">
      <h1>Terms of Service</h1>
      <div className="policy-content">
        <p><em>Last updated: January 2026</em></p>
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using this website, you accept and agree to be bound by these Terms of Service.</p>

        <h2>Products and Services</h2>
        <p>CoreVita products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary. Individual results are not guaranteed.</p>

        <h2>Orders and Payment</h2>
        <p>All orders are subject to availability. We reserve the right to refuse or cancel any order for any reason. Payment is due at the time of order.</p>

        <h2>Subscription Terms</h2>
        <p>Subscriptions automatically renew monthly. You may cancel your subscription at any time through your account settings or by contacting support.</p>

        <h2>Limitation of Liability</h2>
        <p>CoreVita shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our products or services.</p>
      </div>
    </div>
  );
}

export function ShippingPolicy() {
  return (
    <div className="policy-page container">
      <h1>Shipping Policy</h1>
      <div className="policy-content">
        <h2>Free Shipping</h2>
        <p>Free standard shipping on all US orders over $50.</p>

        <h2>Processing Time</h2>
        <p>Orders are processed within 1–2 business days. You'll receive a tracking number via email once your order ships.</p>

        <h2>Delivery Times</h2>
        <ul>
          <li><strong>Standard Shipping (US):</strong> 5–8 business days</li>
          <li><strong>Expedited Shipping (US):</strong> 2–3 business days</li>
          <li><strong>International:</strong> 10–21 business days</li>
        </ul>

        <h2>Shipping Carriers</h2>
        <p>We ship via USPS, FedEx, and UPS depending on your location and selected shipping method.</p>

        <h2>International Orders</h2>
        <p>International customers are responsible for any customs duties, taxes, or fees imposed by their country.</p>

        <h2>Lost or Delayed Packages</h2>
        <p>If your package is lost or significantly delayed, please contact us and we'll work with the carrier to resolve the issue.</p>
      </div>
    </div>
  );
}
