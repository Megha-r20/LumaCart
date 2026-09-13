import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, MapPin, Truck, Check, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import API from '../services/api';

const Checkout = () => {
  const { cartItems, itemsPrice, discountPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useContext(CartContext);
  const { user, updateAddresses } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: user?.addresses?.[0]?.country || 'United States',
    phone: user?.phone || '+1 (555) 019-2834'
  });

  // Credit Card Sandbox state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      addToast('Please fill in all shipping fields', 'error');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to place an order', 'error');
      navigate('/login?redirect=checkout');
      return;
    }

    try {
      setLoading(true);

      // 1. Request Stripe PaymentIntent from backend
      const intentRes = await API.post('/payment/create-payment-intent', { amount: totalPrice });
      const { id: paymentIntentId } = intentRes.data;

      // 2. Submit Order to DB
      const orderPayload = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product
        })),
        shippingAddress,
        paymentMethod: 'Stripe Test Mode',
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        totalPrice
      };

      const { data: createdOrder } = await API.post('/orders', orderPayload);

      // 3. Mark Order Paid with Payment Intent
      await API.put(`/orders/${createdOrder._id}/pay`, {
        id: paymentIntentId,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: user.email
      });

      clearCart();
      addToast('Order placed successfully!', 'success');
      setLoading(false);
      navigate(`/order-success/${createdOrder._id}`);
    } catch (err) {
      setLoading(false);
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <ShieldCheck className="text-gradient" size={32} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Express Checkout</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
        {/* Checkout Steps Form */}
        <div>
          {/* Step 1: Shipping Address */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : 'var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Shipping Address</h3>
            </div>

            {step === 1 ? (
              <form onSubmit={handleAddressSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State / Province</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Continue to Payment <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{shippingAddress.fullName}</strong> — {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => setStep(1)}>Edit</button>
              </div>
            )}
          </div>

          {/* Step 2: Payment Gateway Sandbox */}
          {step === 2 && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                  2
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Payment Method (Stripe Test Gateway)</h3>
              </div>

              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#818CF8', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Lock size={18} />
                <span>Test Mode Active. Pre-filled with standard 4242 test credentials for instant sandbox authorization.</span>
              </div>

              <form onSubmit={handlePlaceOrder}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input type="text" className="form-control" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Expiration Date</label>
                    <input type="text" className="form-control" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC Code</label>
                    <input type="text" className="form-control" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                  {loading ? 'Processing Order via Stripe...' : `Pay $${totalPrice.toFixed(2)} & Complete Order`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Order Review Sidebar */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>Items in Order</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 300, overflowY: 'auto', marginBottom: '1.5rem' }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img src={item.image} alt={item.name} style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div style={{ flex: 1, fontSize: '0.88rem' }}>
                  <div style={{ fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>${(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            {discountPrice > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                <span>Discount</span>
                <span>-${discountPrice.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total</span>
              <span className="text-gradient">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
