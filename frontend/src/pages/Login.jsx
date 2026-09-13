import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, ShieldAlert, UserCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, user, loading } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (user) {
      if (user.role === 'admin' && redirect === 'admin') {
        navigate('/admin');
      } else if (redirect) {
        navigate(`/${redirect}`);
      } else {
        navigate('/');
      }
    }
  }, [user, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      addToast('Logged in successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    }
  };

  const handleDemoUserLogin = () => {
    setEmail('user@lumacart.com');
    setPassword('password123');
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@lumacart.com');
    setPassword('password123');
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: 480 }}>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.25rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 48, height: 48 }}>
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your orders, wishlist, and profile
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            ⚡ One-Click Demo Credentials
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleDemoUserLogin}>
              <UserCheck size={14} /> Customer Demo
            </button>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleDemoAdminLogin}>
              <ShieldAlert size={14} /> Admin Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
