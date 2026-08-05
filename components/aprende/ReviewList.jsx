import StarRating from './StarRating';

export default function ReviewList({ reviews }) {
  if (!reviews?.length) {
    return <p className="aprende-review-empty">Todavía no hay reseñas para este recurso.</p>;
  }

  return (
    <div className="aprende-review-list">
      {reviews.map((review) => (
        <div key={review.id} className="aprende-review">
          <div className="aprende-review-head">
            <span className="aprende-review-avatar">{review.name.charAt(0)}</span>
            <div>
              <strong>{review.name}</strong>
              <StarRating rating={review.rating} showValue={false} size={12} />
            </div>
            <span className="aprende-review-date">
              {new Date(review.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
