import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Package,
  Sliders,
  Sparkles
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { totalItemsCount, setIsCartOpen } = useContext(CartContext);
  const { wishlistCount } = useContext(WishlistContext);

  const [keyword, setKeyword] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.svg" alt="LumaCart Logo" style={{ width: 38, height: 38, borderRadius: '10px' }} />
          <span>LumaCart</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="nav-search">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search headphones, smartwatches, gear..."
            className="search-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* Desktop Navigation */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
              Shop
            </Link>
          </li>

          {/* Wishlist Button */}
          <li>
            <Link to="/wishlist" className="icon-badge-btn" title="Wishlist">
              <Heart size={20} />
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>
          </li>

          {/* Cart Bag Button (Links to full Shopping Bag Page) */}
          <li>
            <Link to="/cart" className="icon-badge-btn" title="Shopping Bag">
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && <span className="badge-count">{totalItemsCount}</span>}
            </Link>
          </li>

          {/* User Account / Admin Portal */}
          <li style={{ position: 'relative' }}>
            {user ? (
              <div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  style={{ gap: '0.5rem', borderRadius: 'var(--radius-full)', padding: '0.4rem 0.85rem' }}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>{user.name.split(' ')[0]}</span>
                </button>

                {isUserDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '120%',
                      width: 240,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 1100,
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                        {isAdmin && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Admin</span>}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>

                    {isAdmin && (
                      <>
                        <Link to="/admin" className="admin-nav-item" style={{ fontSize: '0.85rem', color: '#A5B4FC', fontWeight: 700 }}>
                          <LayoutDashboard size={16} /> Admin Portal
                        </Link>
                        <Link to="/admin/orders" className="admin-nav-item" style={{ fontSize: '0.85rem' }}>
                          <Sliders size={16} /> Store Customer Orders
                        </Link>
                        <div style={{ height: 1, background: 'var(--border-light)', margin: '0.25rem 0' }} />
                      </>
                    )}

                    <Link to="/profile" className="admin-nav-item" style={{ fontSize: '0.85rem' }}>
                      <User size={16} /> My Account
                    </Link>

                    <Link to="/orders" className="admin-nav-item" style={{ fontSize: '0.85rem' }}>
                      <Package size={16} /> My Personal Purchases
                    </Link>

                    <button
                      onClick={logout}
                      className="admin-nav-item"
                      style={{ fontSize: '0.85rem', color: 'var(--danger)', width: '100%', textAlign: 'left', marginTop: '0.25rem' }}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Login / Register
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
