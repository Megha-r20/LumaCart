import React, { useState, useEffect, useContext } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import API from '../../services/api';
import RatingStars from '../../components/RatingStars';
import { NotificationContext } from '../../context/NotificationContext';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useContext(NotificationContext);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/reviews');
      setReviews(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Remove this review from the store?')) {
      try {
        await API.delete(`/reviews/${id}`);
        addToast('Review deleted', 'info');
        fetchReviews();
      } catch (err) {
        addToast('Failed to delete review', 'error');
      }
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>Product Reviews Moderation</h1>

      {loading ? (
        <div className="flex-center" style={{ padding: '4rem' }}><div className="loading-spinner" /></div>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Reviewer</th>
                <th>Rating</th>
                <th>Title & Comment</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(rev => (
                <tr key={rev._id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{rev.product?.name || 'Product'}</div>
                  </td>
                  <td>{rev.name}</td>
                  <td><RatingStars value={rev.rating} size={14} /></td>
                  <td>
                    {rev.title && <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{rev.title}</div>}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{rev.comment}</div>
                  </td>
                  <td>{new Date(rev.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="icon-badge-btn" style={{ width: 32, height: 32, color: 'var(--danger)' }} onClick={() => handleDelete(rev._id)} title="Delete Review">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
