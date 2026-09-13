import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Package, Users, AlertTriangle, TrendingUp, ArrowUpRight, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import API from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!stats) return <div>Failed to load stats</div>;

  const orderStatusData = Object.keys(stats.statusCounts || {}).map(key => ({
    name: key,
    count: stats.statusCounts[key]
  }));

  const BAR_COLORS = {
    Pending: '#F59E0B',
    Processing: '#6366F1',
    Shipped: '#8B5CF6',
    Delivered: '#10B981',
    Cancelled: '#EF4444'
  };

  return (
    <div>
      {/* SaaS Analytics Metric Cards */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="stat-card" style={{ background: '#0F172A', border: '1px solid rgba(99, 102, 241, 0.3)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-20%', width: 120, height: 120, background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }} />
          <div className="stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#34D399', fontWeight: 700 }}>
              <ArrowUpRight size={14} /> +18.4% MoM
            </div>
            <div className="stat-val" style={{ fontSize: '1.7rem', color: '#FFF' }}>${stats.totalRevenue?.toLocaleString()}</div>
            <div className="stat-lbl">Gross Revenue</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#34D399', fontWeight: 700 }}>
              <ArrowUpRight size={14} /> +12.1% MoM
            </div>
            <div className="stat-val" style={{ fontSize: '1.7rem', color: '#FFF' }}>{stats.totalOrders}</div>
            <div className="stat-lbl">Total Customer Orders</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <Package size={22} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.7rem', color: '#FFF' }}>{stats.totalProducts}</div>
            <div className="stat-lbl">Active Products Catalog</div>
          </div>
        </div>

        <div className="stat-card" style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-val" style={{ fontSize: '1.7rem', color: '#FFF' }}>{stats.totalUsers}</div>
            <div className="stat-lbl">Registered Customers</div>
          </div>
        </div>

        {stats.lowStockCount > 0 && (
          <div className="stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
            <div className="stat-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#F87171' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="stat-val" style={{ color: '#F87171', fontSize: '1.7rem' }}>{stats.lowStockCount}</div>
              <div className="stat-lbl" style={{ color: '#FCA5A5' }}>Low Stock Warnings</div>
            </div>
          </div>
        )}
      </div>

      {/* Visual Recharts Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Monthly Revenue Trend Area Chart */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp className="text-gradient" size={20} /> Revenue Performance ($)
            </h3>
            <span className="badge badge-primary">Last 6 Months</span>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.salesChart}>
                <defs>
                  <linearGradient id="colorRevSaaS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: '#07090E', borderColor: 'rgba(99, 102, 241, 0.4)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorRevSaaS)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Breakdown Bar Chart */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Orders by Fulfillment Status</h3>
            <span className="badge badge-success">Live Logistics</span>
          </div>

          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: '#07090E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[entry.name] || '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Tables Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Recent Transactions Feed */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Recent Transactions Stream</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.82rem', color: '#818CF8', fontWeight: 700 }}>View All Orders →</Link>
          </div>

          <div className="data-table-wrap" style={{ background: 'transparent', border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders?.map(order => (
                  <tr key={order._id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{order.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.trackingNumber}</div>
                    </td>
                    <td style={{ fontWeight: 800, color: '#FFF' }}>${order.totalPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${order.status === 'Delivered' ? 'badge-success' : 'badge-primary'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Table */}
        <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F87171' }}>Low Stock Reorder Alert</h3>
            <Link to="/admin/products" style={{ fontSize: '0.82rem', color: '#818CF8', fontWeight: 700 }}>Manage Stock →</Link>
          </div>

          <div className="data-table-wrap" style={{ background: 'transparent', border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>In Stock</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts?.map(prod => (
                  <tr key={prod._id}>
                    <td style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{prod.name}</td>
                    <td>${prod.price?.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-danger">{prod.countInStock} items left</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
