import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ value = 0, numReviews, interactive = false, onChange, size = 16 }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
      {stars.map((star) => {
        const isFilled = value >= star;
        const isHalf = value >= star - 0.5 && value < star;

        return (
          <Star
            key={star}
            size={size}
            fill={isFilled || isHalf ? '#F59E0B' : 'transparent'}
            color={isFilled || isHalf ? '#F59E0B' : '#64748B'}
            style={{ cursor: interactive ? 'pointer' : 'default', transition: 'transform 0.15s ease' }}
            onClick={() => interactive && onChange && onChange(star)}
          />
        );
      })}
      {numReviews !== undefined && (
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: '0.35rem' }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
