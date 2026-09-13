import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (user && user.wishlist) {
      setWishlist(user.wishlist);
    } else {
      const saved = localStorage.getItem('guestWishlist');
      setWishlist(saved ? JSON.parse(saved) : []);
    }
  }, [user]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product;
    
    if (user) {
      try {
        const { data } = await API.post(`/users/wishlist/${productId}`);
        setWishlist(data);
      } catch (err) {
        console.error('Error updating wishlist:', err);
      }
    } else {
      setWishlist(prev => {
        const exists = prev.some(item => (item._id || item) === productId);
        let updated;
        if (exists) {
          updated = prev.filter(item => (item._id || item) !== productId);
        } else {
          updated = [...prev, product];
        }
        localStorage.setItem('guestWishlist', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
