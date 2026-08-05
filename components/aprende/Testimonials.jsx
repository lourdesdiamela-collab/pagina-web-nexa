import { Quote } from 'lucide-react';
import StarRating from './StarRating';

export default function Testimonials({ items }) {
  return (
    <div className="aprende-testimonial-grid">
      {items.map((t) => (
        <div key={t.name} className="aprende-testimonial-card">
          <Quote size={22} className="aprende-testimonial-quote" />
          <StarRating rating={t.rating} showValue={false} size={13} />
          <p>&ldquo;{t.text}&rdquo;</p>
          <div className="aprende-testimonial-author">
            <span className="aprende-testimonial-avatar">{t.name.charAt(0)}</span>
            <div>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
