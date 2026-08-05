import { FileText } from 'lucide-react';
import { getCategoryIcon } from '@/lib/categoryIcons';

export default function ProductCover({ product, size = 'md' }) {
  const Icon = getCategoryIcon(product.category) || FileText;
  const variant = (product.coverSeed ?? 0) % 4;

  return (
    <div
      className={`aprende-cover aprende-cover-${size} aprende-cover-pat-${variant}`}
      style={{ '--cover-color': product.categoryColor }}
    >
      <span className="aprende-cover-icon">
        <Icon size={size === 'lg' ? 40 : 26} strokeWidth={1.6} />
      </span>
      <span className="aprende-cover-meta">
        <FileText size={12} /> {product.pages}p
      </span>
      <span className="aprende-cover-title">{product.title}</span>
    </div>
  );
}
