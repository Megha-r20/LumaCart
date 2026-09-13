import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Plus, Minus, Star, MessageSquare } from 'lucide-react';
import API from '../services/api';
import RatingStars from '../components/RatingStars';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }

        // Fetch reviews
        const revRes = await API.get(`/reviews/product/${data._id}`);
        setReviews(revRes.data || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock <= 0) return;
    addToCart(product, qty);
    addToast(`Added ${qty} × "${product.name}" to cart!`, 'success');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please login to leave a review', 'error');
      return;
    }
    if (!newComment.trim()) {
      addToast('Please enter your review comment', 'error');
      return;
    }

    try {
      setReviewSubmitting(true);
      const { data } = await API.post(`/reviews/${product._id}`, {
        rating: newRating,
        title: newTitle,
        comment: newComment
      });

      addToast('Review submitted successfully!', 'success');
      setReviews([data.review, ...reviews]);
      setNewComment('');
      setNewTitle('');
      setReviewSubmitting(false);
    } catch (err) {
      setReviewSubmitting(false);
      addToast(err.response?.data?.message || 'Failed to submit review', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      {/* Product Main Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        {/* Gallery */}
        <div>
          <div style={{ background: '#0B0F19', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '1rem', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={selectedImage} alt={product.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }}>
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage === img ? '2px solid var(--primary)' : '1px solid var(--border)',
                    opacity: selectedImage === img ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info & Buy Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {product.brand}
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.35rem 0' }}>{product.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <RatingStars value={product.rating} numReviews={product.numReviews} size={18} />
              <span style={{ color: 'var(--border)' }}>|</span>
              <span className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-danger'}`}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '1rem 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
                <span className="badge badge-danger">Save {discountPercent}%</span>
              </>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Add to Cart & Wishlist Controls */}
          {product.countInStock > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div className="qty-control" style={{ padding: '0.35rem' }}>
                <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus size={16} />
                </button>
                <span className="qty-num" style={{ fontSize: '1.05rem', padding: '0 1rem' }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(Math.min(product.countInStock, qty + 1))}>
                  <Plus size={16} />
                </button>
              </div>

              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
                <ShoppingBag size={20} /> Add to Cart
              </button>

              <button
                className={`icon-badge-btn ${inWishlist ? 'active' : ''}`}
                style={{ width: 50, height: 50, borderRadius: 'var(--radius-md)' }}
                onClick={() => {
                  toggleWishlist(product);
                  addToast(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist!', inWishlist ? 'info' : 'success');
                }}
              >
                <Heart size={22} fill={inWishlist ? '#EF4444' : 'none'} color={inWishlist ? '#EF4444' : 'var(--text-primary)'} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Specifications & Customer Reviews Tabs */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare className="text-gradient" size={22} /> Customer Reviews & Rating ({reviews.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {/* Reviews List */}
          <div>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No reviews yet for this product. Be the first to leave your feedback!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div key={rev._id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'} alt={rev.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{rev.name}</span>
                      </div>
                      <RatingStars value={rev.rating} size={14} />
                    </div>
                    {rev.title && <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>{rev.title}</h4>}
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write Review Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Write a Customer Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <RatingStars value={newRating} interactive onChange={(r) => setNewRating(r)} size={24} />
                </div>
                <div className="form-group">
                  <label className="form-label">Review Headline</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Exceptional noise cancellation!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Comment</label>
                  <textarea
                    rows={4}
                    className="form-control"
                    placeholder="Describe sound quality, build, battery life..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  You must be logged in to submit a review.
                </p>
                <Link to="/login" className="btn btn-outline btn-sm">Login Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
