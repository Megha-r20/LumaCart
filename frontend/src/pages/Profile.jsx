import React, { useState, useContext } from 'react';
import { User, MapPin, Lock, Save, Plus, Mail, Phone, ShieldCheck, Home, CheckCircle2, Edit2, Building, Hash } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const Profile = () => {
  const { user, updateProfile, updateAddresses } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Address modal form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrFullName, setAddrFullName] = useState(user?.name || '');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    try {
      setProfileLoading(true);
      await updateProfile({ name, email, phone, password: password || undefined });
      addToast('Profile updated successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
      setProfileLoading(false);
    } catch (err) {
      setProfileLoading(false);
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddrId(addr._id);
    setAddrTitle(addr.title || 'Home');
    setAddrFullName(addr.fullName || user?.name || '');
    setAddrStreet(addr.street || '');
    setAddrCity(addr.city || '');
    setAddrState(addr.state || '');
    setAddrPostalCode(addr.postalCode || '');
    setAddrPhone(addr.phone || user?.phone || '');
    setShowAddressForm(true);
  };

  const handleOpenNewAddress = () => {
    setEditingAddrId(null);
    setAddrTitle('Home');
    setAddrFullName(user?.name || '');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrPostalCode('');
    setAddrPhone(user?.phone || '');
    setShowAddressForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      await updateAddresses({
        _id: editingAddrId,
        title: addrTitle,
        fullName: addrFullName,
        street: addrStreet,
        city: addrCity,
        state: addrState,
        postalCode: addrPostalCode,
        phone: addrPhone,
        country: 'United States',
        isDefault: user?.addresses?.length === 0
      });
      addToast(editingAddrId ? 'Address updated successfully!' : 'New address added successfully!', 'success');
      setShowAddressForm(false);
      setEditingAddrId(null);
    } catch (err) {
      addToast(err.message || 'Failed to save address', 'error');
    }
  };

  const getInitials = (userName) => {
    if (!userName) return 'U';
    return userName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Account Hero Header */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(18, 24, 38, 0.95) 100%)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '2rem 2.5rem', 
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justify-content: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Avatar Ring */}
          <div 
            style={{ 
              width: 72, 
              height: 72, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              display: 'flex', 
              alignItems: 'center', 
              justify-content: 'center', 
              color: '#FFFFFF', 
              fontSize: '1.75rem', 
              fontWeight: 800,
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {getInitials(user?.name)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{user?.name || 'Account Settings'}</h1>
              <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                {user?.role === 'admin' ? '⚡ Executive Admin' : 'Verified Member'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>
              {user?.email || 'Manage your security preferences and shipping destinations'}
            </p>
          </div>
        </div>

        {/* Quick Stats Pill Badges */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Saved Addresses</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{user?.addresses?.length || 0}</div>
          </div>
          <div style={{ background: 'rgba(7, 9, 14, 0.6)', border: '1px solid var(--border)', padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Security</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'center' }}>
              <ShieldCheck size={16} /> Active
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Profile Settings & Address Book */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        
        {/* Card 1: Personal Profile */}
        <div 
          style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div className="brand-icon" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)' }}>
              <User size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Personal Profile</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Update your contact information and access credentials</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  className="form-control" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Alexander Wright"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  className="form-control" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="user@lumacart.com"
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-icon-wrapper">
                <Phone className="input-icon" size={18} />
                <input 
                  type="text" 
                  className="form-control" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+1 (555) 432-8765"
                />
              </div>
            </div>

            {/* Password Section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Lock size={16} style={{ color: 'var(--primary)' }} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Security & Password</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>(Optional)</span>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="input-icon-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Leave blank to keep current password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="input-icon-wrapper">
                  <CheckCircle2 className="input-icon" size={18} />
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Re-enter new password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', marginTop: 'auto' }} 
              disabled={profileLoading}
            >
              <Save size={18} /> {profileLoading ? 'Saving Preferences...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Card 2: Address Book */}
        <div 
          style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="brand-icon" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--secondary), var(--accent-cyan))' }}>
                <MapPin size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Shipping Addresses</h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Manage saved delivery destinations</p>
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleOpenNewAddress}>
              <Plus size={16} /> Add Address
            </button>
          </div>

          {user?.addresses && user.addresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
              {user.addresses.map((addr) => (
                <div 
                  key={addr._id} 
                  style={{ 
                    background: 'var(--bg-card)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '1.35rem', 
                    position: 'relative',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: '#F8FAFC' }}>
                        {addr.title || 'Home Address'}
                      </span>
                      {addr.isDefault && <span className="badge badge-success">DEFAULT</span>}
                    </div>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                      onClick={() => handleOpenEditAddress(addr)}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '0.2rem' }}>{addr.fullName}</strong>
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.postalCode}<br />
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Phone: {addr.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
              <MapPin size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>No Saved Addresses</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 280, marginBottom: '1.25rem' }}>
                Add your primary delivery address for faster express checkout.
              </p>
              <button className="btn btn-primary btn-sm" onClick={handleOpenNewAddress}>
                <Plus size={16} /> Add First Address
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modern Add / Edit Address Modal Dialog */}
      {showAddressForm && (
        <div className="modal-overlay" onClick={() => setShowAddressForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin className="text-gradient" size={22} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  {editingAddrId ? 'Edit Shipping Address' : 'Add New Shipping Address'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddressForm(false)} 
                style={{ color: 'var(--text-muted)', fontSize: '1.5rem', lineHeight: 1, padding: '0.2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAddress}>
              <div className="form-group">
                <label className="form-label">Address Label / Title</label>
                <div className="input-icon-wrapper">
                  <Home className="input-icon" size={18} />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Home, Office, Apartment, etc." 
                    value={addrTitle} 
                    onChange={(e) => setAddrTitle(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Recipient Full Name</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    className="form-control" 
                    value={addrFullName} 
                    onChange={(e) => setAddrFullName(e.target.value)} 
                    placeholder="Alexander Wright"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <div className="input-icon-wrapper">
                  <Building className="input-icon" size={18} />
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="1428 Elmwood Ave, Suite 400"
                    value={addrStreet} 
                    onChange={(e) => setAddrStreet(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Austin"
                    value={addrCity} 
                    onChange={(e) => setAddrCity(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State / Province</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="TX"
                    value={addrState} 
                    onChange={(e) => setAddrState(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Postal / Zip Code</label>
                  <div className="input-icon-wrapper">
                    <Hash className="input-icon" size={18} />
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="78701"
                      value={addrPostalCode} 
                      onChange={(e) => setAddrPostalCode(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <div className="input-icon-wrapper">
                    <Phone className="input-icon" size={18} />
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="+1 (555) 432-8765"
                      value={addrPhone} 
                      onChange={(e) => setAddrPhone(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Address
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddressForm(false)}>
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

export default Profile;
