import React, { useState, useContext } from 'react';
import { User, MapPin, Lock, Save, Plus, Trash2 } from 'lucide-react';
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
      addToast('Address saved successfully!', 'success');
      setShowAddressForm(false);
      setEditingAddrId(null);
      setAddrStreet('');
      setAddrCity('');
      setAddrState('');
      setAddrPostalCode('');
    } catch (err) {
      addToast(err.message || 'Failed to save address', 'error');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem' }}>Account Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        {/* Profile Settings */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User className="text-gradient" size={20} /> Personal Profile
          </h2>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>Change Password (Optional)</h4>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" placeholder="Leave blank to keep current" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" placeholder="Re-enter new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={profileLoading}>
              <Save size={18} /> {profileLoading ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Address Book Management */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin className="text-gradient" size={20} /> Shipping Addresses
            </h2>
            <button className="btn btn-secondary btn-sm" onClick={() => { setShowAddressForm(true); setEditingAddrId(null); }}>
              <Plus size={16} /> Add New Address
            </button>
          </div>

          {user?.addresses && user.addresses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {user.addresses.map((addr) => (
                <div key={addr._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', position: 'relative' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: 'var(--primary)' }}>
                    {addr.title || 'Home Address'} {addr.isDefault && <span className="badge badge-success">Default</span>}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>{addr.fullName}</strong><br />
                    {addr.street}, {addr.city}, {addr.state} {addr.postalCode}<br />
                    Phone: {addr.phone}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No addresses saved yet.</p>
          )}

          {/* Add/Edit Address Modal */}
          {showAddressForm && (
            <div className="modal-overlay" onClick={() => setShowAddressForm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>Save Shipping Address</h3>
                <form onSubmit={handleSaveAddress}>
                  <div className="form-group">
                    <label className="form-label">Address Title</label>
                    <input type="text" className="form-control" placeholder="Home / Work" value={addrTitle} onChange={(e) => setAddrTitle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" value={addrFullName} onChange={(e) => setAddrFullName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input type="text" className="form-control" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" className="form-control" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" className="form-control" value={addrState} onChange={(e) => setAddrState(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label className="form-label">Postal Code</label>
                      <input type="text" className="form-control" value={addrPostalCode} onChange={(e) => setAddrPostalCode(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input type="text" className="form-control" value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Address</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddressForm(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
