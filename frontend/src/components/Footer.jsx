import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, Headphones, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      {/* Value Propositions */}
      <div style={{ borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Express Shipping</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Free delivery on orders over $100</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>2-Year Warranty</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>100% genuine guaranteed gear</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
              <Headphones size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24/7 Expert Support</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Dedicated audio & tech team</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Stripe Secure Checkout</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>256-bit encrypted transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <Link to="/" className="brand-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="brand-icon">
                <Sparkles size={22} />
              </div>
              <span>LumaCart</span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              LumaCart is a flagship e-commerce platform delivering high performance audio gear, smart wearables, laptops, and ambient home electronics.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Customer Experience</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <li><Link to="/shop">Shop All Products</Link></li>
              <li><Link to="/wishlist">Saved Wishlist</Link></li>
              <li><Link to="/orders">Order Tracking</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Promotions & Savings</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Use promo code <strong style={{ color: 'var(--primary)' }}>LUMA20</strong> at checkout for 20% off your first order!
            </p>
            <div className="badge badge-primary">Internship Portfolio Demo</div>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Admin & Access</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Demo Credentials:<br />
              User: <code>user@lumacart.com</code> / <code>password123</code><br />
              Admin: <code>admin@lumacart.com</code> / <code>password123</code>
            </p>
            <Link to="/admin" className="btn btn-outline btn-sm">
              Launch Executive Admin Dashboard
            </Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>© {new Date().getFullYear()} LumaCart E-Commerce. All rights reserved.</div>
          <div>Built with React, Node.js, Express, MongoDB & Stripe.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
