import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <Heart className="text-gradient" size={32} fill="#EF4444" color="#EF4444" />
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Saved Wishlist</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            {wishlist.length} items saved for later
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '4rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💖</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Explore our catalog and click the heart icon to save products.</p>
          <Link to="/shop" className="btn btn-primary">Browse Shop</Link>
        </div>
      ) : (
        <div className="products-grid">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
