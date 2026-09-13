import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, FileText } from 'lucide-react';
import API from '../services/api';
import OrderTimeline from '../components/OrderTimeline';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to My Orders</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
        <ArrowLeft size={18} /> Back to Order History
      </Link>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Tracking ID: {order.trackingNumber}</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order Details</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            Status: {order.status}
          </span>
        </div>
      </div>

      {/* Progress Status Timeline */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Fulfillment & Logistics Status</h3>
        <OrderTimeline status={order.status} trackingLogs={order.trackingLogs} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Itemized Breakdown */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Purchased Items</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.orderItems?.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                <img src={item.image} alt={item.name} style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${item.product}`} style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.98rem' }}>
                    {item.name}
                  </Link>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    ${item.price?.toFixed(2)} × {item.qty}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} className="text-gradient" /> Shipping Address
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>{order.shippingAddress?.fullName}</strong><br />
              {order.shippingAddress?.street}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country}<br />
              Phone: {order.shippingAddress?.phone}
            </p>
          </div>

          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} className="text-gradient" /> Payment Invoice
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Total</span>
                <span>${order.itemsPrice?.toFixed(2)}</span>
              </div>
              {order.discountPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                  <span>Discount</span>
                  <span>-${order.discountPrice?.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                <span>${order.shippingPrice?.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tax</span>
                <span>${order.taxPrice?.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800 }}>
                <span>Total Amount</span>
                <span className="text-gradient">${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
