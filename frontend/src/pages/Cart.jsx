import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck, Truck, Sparkles, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    itemsPrice,
    discountPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    applyPromoCode,
    promoCode
  } = useContext(CartContext);

  const { addToast } = useContext(NotificationContext);
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    if (res.success) {
      addToast(res.message, 'success');
    } else {
      addToast(res.message, 'error');
    }
  };

  const handleQuickChipCoupon = (code) => {
    setCouponInput(code);
    const res = applyPromoCode(code);
    if (res.success) {
      addToast(res.message, 'success');
    }
  };

  // Free shipping threshold calculation ($100)
  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - itemsPrice);
  const shippingProgress = Math.min(100, (itemsPrice / freeShippingThreshold) * 100);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.75rem', textAlign: 'center', maxWidth: 650 }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#818CF8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem' }}>
          <ShoppingBag size={48} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.65rem' }}>Your Shopping Bag is Empty</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Discover beryllium audio headphones, titanium smartwatches, and flagships engineered for technology purists.
        </p>
        <Link to="/shop" className="btn btn-primary btn-lg">
          Explore Catalog <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <div className="badge badge-primary" style={{ marginBottom: '0.5rem', gap: '0.4rem' }}>
            <Sparkles size={14} /> Review Your Order
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>Shopping Bag</h1>
        </div>
        <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {cartItems.reduce((sum, item) => sum + item.qty, 0)} Items Selected
        </span>
      </div>

      {/* Free Shipping Meter Banner */}
      <div style={{ background: '#0F172A', border: '1px solid rgba(99, 102, 241, 0.3)', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem', fontSize: '0.92rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 700 }}>
            <Truck size={18} color="#818CF8" />
            <span>
              {amountToFreeShipping === 0 ? (
                <span style={{ color: '#34D399' }}>🎉 Congratulations! You unlocked FREE Express Shipping!</span>
              ) : (
                <span>Add <strong style={{ color: '#A5B4FC' }}>${amountToFreeShipping.toFixed(2)}</strong> more to get FREE Express Shipping!</span>
              )}
            </span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{Math.round(shippingProgress)}%</span>
        </div>
        <div style={{ height: 6, background: '#1E293B', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${shippingProgress}%`, background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #10B981)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
        {/* Left Column: Cart Items & Promo Codes */}
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  transition: 'all var(--transition-fast)',
                  position: 'relative'
                }}
                className="cart-page-item"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 96, height: 96, borderRadius: 'var(--radius-md)', objectFit: 'cover', background: '#07090E', border: '1px solid var(--border)' }}
                />

                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {item.name}
                  </Link>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    Unit Price: <span style={{ color: '#A5B4FC', fontWeight: 600 }}>${item.price?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="qty-control" style={{ background: '#07090E', padding: '0.25rem' }}>
                  <button className="qty-btn" onClick={() => updateQuantity(item.product, item.qty - 1)} title="Decrease Qty">
                    <Minus size={14} />
                  </button>
                  <span className="qty-num" style={{ fontSize: '0.95rem', padding: '0 0.75rem' }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.product, item.qty + 1)} title="Increase Qty">
                    <Plus size={14} />
                  </button>
                </div>

                {/* Line Price */}
                <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', width: 110, textAlign: 'right', color: '#FFF' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                {/* Delete Item Button */}
                <button
                  onClick={() => removeFromCart(item.product)}
                  style={{ color: 'var(--text-muted)', transition: 'color 0.15s ease', padding: '0.4rem' }}
                  title="Remove Item"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F87171'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Promo Coupon Card */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <Tag size={20} color="#818CF8" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Apply Promo Code</h3>
            </div>

            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Enter code (e.g. LUMA20)"
                className="form-control"
                style={{ textTransform: 'uppercase', letterSpacing: '1px', background: '#07090E' }}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                Apply Code
              </button>
            </form>

            {/* Suggested Coupon Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.82rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)' }}>Quick Offers:</span>
              <button
                type="button"
                onClick={() => handleQuickChipCoupon('LUMA20')}
                className={`badge ${promoCode === 'LUMA20' ? 'badge-success' : 'badge-primary'}`}
                style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
              >
                LUMA20 (20% OFF)
              </button>
              <button
                type="button"
                onClick={() => handleQuickChipCoupon('INTERN10')}
                className={`badge ${promoCode === 'INTERN10' ? 'badge-success' : 'badge-primary'}`}
                style={{ cursor: 'pointer', padding: '0.35rem 0.75rem' }}
              >
                INTERN10 (10% OFF)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal</span>
                <span style={{ fontWeight: 600 }}>${itemsPrice.toFixed(2)}</span>
              </div>

              {discountPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34D399', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={14} /> Discount ({promoCode})
                  </span>
                  <span>-${discountPrice.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Shipping</span>
                <span style={{ fontWeight: 600, color: shippingPrice === 0 ? '#34D399' : 'inherit' }}>
                  {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Tax (8%)</span>
                <span style={{ fontWeight: 600 }}>${taxPrice.toFixed(2)}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Total Price</span>
                <span className="text-gradient" style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={20} />
            </button>
          </div>

          {/* Stripe Security & Guarantee Card */}
          <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.65rem', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8' }}>
              <ShieldCheck size={26} />
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <strong style={{ color: '#FFF', display: 'block', fontSize: '0.88rem' }}>Stripe 256-Bit SSL Encrypted</strong>
              Safe & guaranteed checkout in test mode.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
