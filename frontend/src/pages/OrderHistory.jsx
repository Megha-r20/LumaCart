import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';
import API from '../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/myorders')
      .then(res => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="badge badge-success">Delivered</span>;
      case 'Shipped': return <span className="badge badge-primary">Out for Delivery</span>;
      case 'Processing': return <span className="badge badge-warning">Processing</span>;
      case 'Cancelled': return <span className="badge badge-danger">Cancelled</span>;
      default: return <span className="badge badge-secondary">Pending</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Package className="text-gradient" size={32} />
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>My Orders History</h1>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
          <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID / Tracking</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{order.trackingNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {order._id}</div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.orderItems?.length || 0} items</td>
                  <td style={{ fontWeight: 700 }}>${order.totalPrice?.toFixed(2)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <Link to={`/orders/${order._id}`} className="btn btn-secondary btn-sm">
                      Details <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
