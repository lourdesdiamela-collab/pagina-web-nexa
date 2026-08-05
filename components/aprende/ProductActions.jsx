'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Share2, Check } from 'lucide-react';
import { useCart } from './CartContext';

export default function ProductActions({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);

  function handleAddToCart() {
    addItem(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product.slug, 1);
    router.push('/aprende/carrito');
  }

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = { title: product.title, text: product.subtitle, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      /* usuario canceló el share nativo — no hacemos nada */
    }
  }

  return (
    <div className="aprende-product-actions">
      <button type="button" className="btn btn-primary" onClick={handleBuyNow}>
        <Zap size={16} /> Comprar ahora
      </button>
      <button type="button" className="btn btn-outline" onClick={handleAddToCart}>
        {added ? <Check size={16} /> : <ShoppingCart size={16} />}
        {added ? 'Agregado' : 'Agregar al carrito'}
      </button>
      <button type="button" className="aprende-share-btn" onClick={handleShare} aria-label="Compartir">
        {shared ? <Check size={16} /> : <Share2 size={16} />}
      </button>
    </div>
  );
}
