import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post('/users/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post('/users', { name, email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const { data } = await API.put('/users/profile', profileData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : err.message;
      throw new Error(message);
    }
  };

  const updateAddresses = async (addressData) => {
    try {
      const { data: addresses } = await API.post('/users/address', addressData);
      const updatedUser = { ...user, addresses };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      return addresses;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updateAddresses,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
