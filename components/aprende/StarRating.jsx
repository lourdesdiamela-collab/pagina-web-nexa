import { Star } from 'lucide-react';

/*
 * Si un producto todavía no tiene ninguna reseña, no se dibujan estrellas
 * vacías ni "0.0 (0)": simplemente no se muestra nada. Un producto sin
 * valoraciones no es un producto mal valorado.
 *
 * `emptyLabel` permite mostrar un texto neutro en su lugar (se usa en la ficha
 * de producto, donde el hueco se nota).
 */
export default function StarRating({ rating, size = 14, showValue = true, count, emptyLabel = null }) {
  const hasReviews = typeof count === 'number' ? count > 0 : rating > 0;

  if (!hasReviews) {
    return emptyLabel ? <span className="aprende-stars-empty">{emptyLabel}</span> : null;
  }

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
