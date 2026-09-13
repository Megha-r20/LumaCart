import React, { useState, useEffect } from 'react';
import { Users, Mail, ShieldAlert } from 'lucide-react';
import API from '../../services/api';

const CustomerList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users')
      .then(res => {
        setUsers(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Registered Customers Directory</h1>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}><div className="loading-spinner" /></div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} alt={u.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ fontWeight: 700 }}>{u.name}</div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
