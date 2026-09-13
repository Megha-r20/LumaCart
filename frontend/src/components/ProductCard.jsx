import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import RatingStars from './RatingStars';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { NotificationContext } from '../context/NotificationContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToast } = useContext(NotificationContext);

  const inWishlist = isInWishlist(product._id);

  const handleCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.countInStock <= 0) {
      addToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }
    addToCart(product, 1);
    addToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist!', inWishlist ? 'info' : 'success');
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <Link to={`/product/${product.slug || product._id}`}>
          <img
            src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        </Link>
        {discountPercent > 0 && (
          <div className="badge badge-danger" style={{ position: 'absolute', top: 12, left: 12 }}>
            -{discountPercent}% OFF
          </div>
        )}
        {product.countInStock <= 0 && (
          <div className="badge badge-warning" style={{ position: 'absolute', bottom: 12, left: 12 }}>
            Sold Out
          </div>
        )}
        <button
          className={`product-wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={inWishlist ? '#EF4444' : 'none'} color={inWishlist ? '#EF4444' : '#FFFFFF'} />
        </button>
      </div>

      <div className="product-info">
        <div className="product-brand">{product.brand || 'LumaCart'}</div>
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        
        <div className="rating-row">
          <RatingStars value={product.rating} numReviews={product.numReviews} size={14} />
        </div>

        <div className="product-price-row">
          <div className="price-box">
            <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
            )}
          </div>
          <button
            className="add-cart-btn"
            onClick={handleCartClick}
            disabled={product.countInStock <= 0}
            title={product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
