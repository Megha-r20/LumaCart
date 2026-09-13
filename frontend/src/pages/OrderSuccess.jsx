import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Truck, FileText } from 'lucide-react';
import API from '../services/api';

const OrderSuccess = () => {
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

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: 700 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
        <CheckCircle2 size={48} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Order Confirmed!</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
        Thank you for your purchase. We have received your payment and our warehouse team is preparing your package.
      </p>

      {order && (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Tracking ID</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{order.trackingNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Paid</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>${order.totalPrice?.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>Ships to:</strong> {order.shippingAddress?.fullName}, {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to={`/orders/${id}`} className="btn btn-primary">
          <Package size={18} /> View Order Status & Tracking Timeline
        </Link>
        <Link to="/shop" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
