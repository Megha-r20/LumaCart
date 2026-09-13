import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    itemsPrice,
    totalPrice,
    totalItemsCount
  } = useContext(CartContext);

  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" style={{ background: '#0F172A', borderLeft: '1px solid rgba(255, 255, 255, 0.1)' }} onClick={(e) => e.stopPropagation()}>
        <div className="cart-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShoppingBag size={18} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Shopping Bag ({totalItemsCount})</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="icon-badge-btn" style={{ width: 34, height: 34 }}>
            <X size={18} />
          </button>
        </div>

        <div className="cart-body" style={{ padding: '1.5rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛍️</div>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1.15rem', fontWeight: 700 }}>Your bag is empty</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                Discover our latest acoustic gear and flagships.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
              >
                Explore Products
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product} className="cart-item" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                <img src={item.image} alt={item.name} className="cart-item-img" style={{ border: '1px solid var(--border)' }} />
                <div className="cart-item-details">
                  <h4 className="cart-item-title" style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.35 }}>{item.name}</h4>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#A5B4FC', margin: '0.35rem 0 0.65rem' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="qty-control" style={{ background: '#07090E', padding: '0.2rem' }}>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product, item.qty - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="qty-num" style={{ fontSize: '0.85rem' }}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.product, item.qty + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      style={{ color: 'var(--text-muted)', opacity: 0.8 }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', background: '#0B0F19', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${itemsPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              <span>Estimated Total</span>
              <span className="text-gradient">${totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckoutClick}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/cart');
                }}
              >
                View Full Bag & Apply Coupons
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
