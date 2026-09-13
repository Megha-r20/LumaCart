import React, { useState, useEffect, useContext } from 'react';
import { ShoppingBag, Edit2, Filter, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import API from '../../services/api';
import { NotificationContext } from '../../context/NotificationContext';
import OrderTimeline from '../../components/OrderTimeline';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const { addToast } = useContext(NotificationContext);

  // Status Change Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Processing');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders');
      setOrders(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      await API.put(`/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        note: statusNote || `Order status updated to ${newStatus}.`
      });

      addToast(`Order status updated to "${newStatus}"!`, 'success');
      setSelectedOrder(null);
      setUpdating(false);
      fetchOrders();
    } catch (err) {
      setUpdating(false);
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Centralized Customer Order Processing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Monitor live logistics, verify Stripe payments, and issue tracking updates</p>
        </div>

        {/* Status Filter Pill Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', padding: '0.35rem' }}>
          {statusOptions.map(st => {
            const isSel = (st === 'All' && statusFilter === '') || statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st === 'All' ? '' : st)}
                className={`btn btn-sm ${isSel ? 'btn-primary' : ''}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.8rem',
                  background: isSel ? undefined : 'transparent',
                  color: isSel ? undefined : 'var(--text-secondary)'
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '5rem' }}><div className="loading-spinner" /></div>
      ) : (
        <div className="data-table-wrap" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Customer</th>
                <th>Order Date</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Fulfillment Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 800, color: '#A5B4FC', fontFamily: 'var(--font-heading)' }}>{order.trackingNumber}</td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{order.user?.name || 'Customer'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 800, color: '#FFF' }}>${order.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                      ● {order.isPaid ? 'Paid (Stripe)' : 'Unpaid'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : order.status === 'Cancelled' ? 'badge-danger' : 'badge-primary'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.status);
                        setStatusNote('');
                      }}
                    >
                      <Edit2 size={14} /> Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Modification Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 'var(--radius-lg)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              Order Logistics Update — {selectedOrder.trackingNumber}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Recipient: {selectedOrder.user?.name} ({selectedOrder.user?.email})
            </p>

            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">Update Status</label>
                <select
                  className="form-control"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped (In Transit)</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tracking Audit Log Note</label>
                <textarea
                  rows={3}
                  className="form-control"
                  placeholder="e.g. Package handed to carrier FedEx tracking #FX-889977."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', marginTop: '1rem' }}>
                <h4 style={{ fontSize: '0.88rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status Timeline Preview:</h4>
                <OrderTimeline status={newStatus} trackingLogs={selectedOrder.trackingLogs} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={updating}>
                  {updating ? 'Saving...' : 'Save & Update Customer'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
