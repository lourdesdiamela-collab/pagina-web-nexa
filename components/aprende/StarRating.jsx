import { Star } from 'lucide-react';

export default function StarRating({ rating, size = 14, showValue = true, count }) {
  const full = Math.round(rating);
  return (
    <span className="aprende-stars" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < full ? '#D2F23A' : 'none'}
          stroke={i < full ? '#B8D62E' : 'rgba(16,18,34,0.25)'}
          strokeWidth={1.6}
        />
      ))}
      {showValue && <span className="aprende-stars-value">{rating.toFixed(1)}</span>}
      {typeof count === 'number' && <span className="aprende-stars-count">({count})</span>}
    </span>
  );
}
