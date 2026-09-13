import React, { useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Bell,
  ChevronRight,
  Activity
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Authorization Required</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          You must be logged in as an administrator to view the executive control plane.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/login?redirect=admin')}>
          Login as Admin Demo
        </button>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', label: 'Executive Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Product Catalog', icon: Package },
    { path: '/admin/categories', label: 'Category Manager', icon: FolderTree },
    { path: '/admin/orders', label: 'Order Processing', icon: ShoppingBag },
    { path: '/admin/customers', label: 'Customer Directory', icon: Users },
    { path: '/admin/reviews', label: 'Review Moderation', icon: MessageSquare }
  ];

  const currentNav = navItems.find(item => item.path === location.pathname) || navItems[0];

  return (
    <div className="admin-layout" style={{ background: '#07090E', minHeight: '100vh' }}>
      {/* SaaS Sidebar */}
      <aside className="admin-sidebar" style={{ background: '#0B0F19', borderRight: '1px solid rgba(255, 255, 255, 0.08)', width: 270 }}>
        <div className="admin-sidebar-header" style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div className="brand-icon" style={{ width: 36, height: 36 }}>
              <Sparkles size={20} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: '#FFF' }}>LumaConsole</span>
              <div style={{ fontSize: '0.72rem', color: '#A5B4FC', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Enterprise SaaS</div>
            </div>
          </Link>
        </div>

        <nav className="admin-nav" style={{ padding: '1.5rem 1rem' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 0.75rem 0.5rem' }}>
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                style={{
                  position: 'relative',
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.35rem'
                }}
              >
                <Icon size={18} color={isActive ? '#818CF8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: 'var(--primary)', borderRadius: '0 4px 4px 0' }} />
                )}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <Link to="/" className="admin-nav-item" style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} /> Exit to Storefront
          </Link>
          <button onClick={logout} className="admin-nav-item" style={{ color: '#F87171', width: '100%', textAlign: 'left' }}>
            <LogOut size={16} /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main SaaS Canvas */}
      <main className="admin-main" style={{ flex: 1, padding: '2rem 2.5rem' }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <span>LumaConsole</span>
              <ChevronRight size={14} />
              <span style={{ color: '#A5B4FC', fontWeight: 600 }}>{currentNav.label}</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800 }}>{currentNav.label}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* System Status Dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', color: '#34D399', fontWeight: 700 }}>
              <Activity size={14} /> API & DB Operational
            </div>

            <Link to="/orders" className="btn btn-secondary btn-sm" style={{ fontSize: '0.82rem', gap: '0.4rem', border: '1px solid var(--border)' }} title="View personal orders placed as customer">
              <ShoppingBag size={14} /> My Personal Purchases
            </Link>

            <div style={{ height: 24, width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--primary)', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFF' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
