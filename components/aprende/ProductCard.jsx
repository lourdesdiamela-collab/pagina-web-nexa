'use client';

import Link from 'next/link';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';
import ProductCover from './ProductCover';
import StarRating from './StarRating';
import { useCart } from './CartContext';
import { formatPrice } from '@/lib/products.mjs';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  return (
    <article className="aprende-card">
      <Link href={`/aprende/producto/${product.slug}`} className="aprende-card-link">
        <div className="aprende-card-cover-wrap">
          <ProductCover product={product} />
          {product.deal && <span className="aprende-badge aprende-badge-deal">Oferta</span>}
          {!product.deal && product.isNew && <span className="aprende-badge aprende-badge-new">Nuevo</span>}
          {!product.deal && !product.isNew && product.bestSeller && <span className="aprende-badge aprende-badge-best">Más vendido</span>}
        </div>
        <div className="aprende-card-body">
          <span className="aprende-card-category" style={{ '--cat-color': product.categoryColor }}>{product.categoryLabel}</span>
          <h3 className="aprende-card-title">{product.title}</h3>
          <p className="aprende-card-subtitle">{product.subtitle}</p>
          <StarRating rating={product.rating} count={product.reviewsCount} size={12} />
        </div>
      </Link>
      <div className="aprende-card-footer">
        <div className="aprende-card-price">
          {product.compareAtPrice && (
            <span className="aprende-card-price-old">{formatPrice(product.compareAtPrice)}</span>
          )}
          <span className="aprende-card-price-now">{formatPrice(product.price)}</span>
        </div>
        <button type="button" className={`aprende-quick-add ${added ? 'added' : ''}`} onClick={handleAdd} aria-label="Agregar al carrito">
          {added ? <Check size={16} /> : <Plus size={16} />}
        </button>
      </div>
    </article>
  );
}
