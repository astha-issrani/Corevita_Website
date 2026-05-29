import React from 'react';
import { useContent } from '../utils/useContent';
import { renderRichText } from '../utils/renderRichText';
import './PolicyPages.css';

function RichBody({ text }) {
  if (!text) return null;
  return renderRichText(text, { className: 'policy-content' });
}

function PolicyPage({ section, defaultTitle, defaultBody }) {
  const { c } = useContent('policy');
  const title = c(section, 'title', defaultTitle);
  const body  = c(section, 'body',  defaultBody);
  return (
    <div className="policy-page container">
      <h1>{title}</h1>
      <RichBody text={body} />
    </div>
  );
}

export function RefundPolicy() {
  return (
    <PolicyPage
      section="refund"
      defaultTitle="Refund Policy"
      defaultBody={"**30-Day Money Back Guarantee**\n\nWe stand behind our products 100%. If you're not completely satisfied with CoreVita Bee Pearl within 30 days of purchase, we'll give you a full refund — no questions asked.\n\n**How to Request a Refund**\n\nContact our support team at support@corevita.com. Include your order number and reason for return. We'll respond within 24 hours with return instructions.\n\n**Refund Processing**\n\nOnce we receive your return, refunds are processed within 5–7 business days to your original payment method.\n\n**Non-Refundable Items**\n\nItems that have been opened and used for more than 30 days are not eligible for a refund. Shipping costs are non-refundable."}
    />
  );
}

export function PrivacyPolicy() {
  return (
    <PolicyPage
      section="privacy"
      defaultTitle="Privacy Policy"
      defaultBody={"Last updated: January 2026\n\n**Information We Collect**\n\nWe collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you make a purchase.\n\n**How We Use Your Information**\n\nWe use your information to: process transactions, send order confirmations and updates, respond to your requests, and send marketing communications (with your consent).\n\n**Information Sharing**\n\nWe do not sell, trade, or otherwise transfer your personal information to outside parties except to trusted third parties who assist us in operating our website.\n\n**Contact Us**\n\nIf you have any questions about this privacy policy, please contact us at privacy@corevita.com."}
    />
  );
}

export function TermsOfService() {
  return (
    <PolicyPage
      section="terms"
      defaultTitle="Terms of Service"
      defaultBody={"Last updated: January 2026\n\n**Acceptance of Terms**\n\nBy accessing and using this website, you accept and agree to be bound by these Terms of Service.\n\n**Products and Services**\n\nCoreVita products are dietary supplements and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary. Individual results are not guaranteed.\n\n**Orders and Payment**\n\nAll orders are subject to availability. We reserve the right to refuse or cancel any order for any reason. Payment is due at the time of order.\n\n**Subscription Terms**\n\nSubscriptions automatically renew monthly. You may cancel your subscription at any time through your account settings or by contacting support."}
    />
  );
}

export function ShippingPolicy() {
  return (
    <PolicyPage
      section="shipping"
      defaultTitle="Shipping Policy"
      defaultBody={"**Free Shipping**\n\nFree standard shipping on all US orders over $50.\n\n**Processing Time**\n\nOrders are processed within 1–2 business days. You'll receive a tracking number via email once your order ships.\n\n**Delivery Times**\n\nStandard Shipping (US): 5–8 business days\nExpedited Shipping (US): 2–3 business days\nInternational: 10–21 business days\n\n**International Orders**\n\nInternational customers are responsible for any customs duties, taxes, or fees imposed by their country."}
    />
  );
}