'use client';

import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCover from '@/components/aprende/ProductCover';
import { useCart } from '@/components/aprende/CartContext';
import { formatPrice } from '@/lib/products.mjs';
import { nextPromoHint } from '@/lib/pricing';
import UrgencyCountdown from '@/components/aprende/UrgencyCountdown';

export default function CartPage() {
  const { items, updateQty, removeItem, totals, isLoaded, resolveProduct, catalogLoaded } = useCart();

  const resolved = items
    .map((item) => ({ item, product: resolveProduct(item.slug) }))
    .filter((r) => r.product);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80 }}>
          <Link href="/aprende" className="aprende-back-link">
            <ArrowLeft size={14} /> Seguir explorando
          </Link>

          <div className="section-header" style={{ textAlign: 'left', marginBottom: 28 }}>
            <span className="section-tag">Tu carrito</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Carrito de compras</h1>
          </div>

          {!isLoaded || !catalogLoaded ? null : resolved.length === 0 ? (
            <div className="aprende-cart-empty">
              <ShoppingBag size={40} />
              <h3>Tu carrito está vacío</h3>
              <p>Explorá el catálogo y sumá tus primeras guías.</p>
              <Link href="/aprende" className="btn btn-primary">Ver catálogo</Link>
            </div>
          ) : (
            <div className="aprende-cart-layout">
              <div className="aprende-cart-items">
                {resolved.map(({ item, product }) => (
                  <div key={product.slug} className="aprende-cart-item">
                    <div className="aprende-cart-item-cover">
                      <ProductCover product={product} size="sm" />
                    </div>
                    <div className="aprende-cart-item-info">
                      <span className="aprende-card-category" style={{ color: product.categoryColor }}>{product.categoryLabel}</span>
                      <Link href={`/aprende/producto/${product.slug}`}>
                        <h3>{product.title}</h3>
                      </Link>
                      <span className="aprende-cart-item-price">{formatPrice(product.price)} c/u</span>
                    </div>
                    <div className="aprende-cart-item-qty">
                      <button type="button" onClick={() => updateQty(product.slug, item.qty - 1)} aria-label="Restar"><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(product.slug, item.qty + 1)} aria-label="Sumar"><Plus size={14} /></button>
                    </div>
                    <div className="aprende-cart-item-subtotal">{formatPrice(product.price * item.qty)}</div>
                    <button type="button" className="aprende-cart-item-remove" onClick={() => removeItem(product.slug)} aria-label="Eliminar">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <aside className="aprende-cart-summary">
                <h3>Resumen</h3>
                <div className="aprende-cart-summary-row">
                  <span>Subtotal ({totals.totalUnits} recurso{totals.totalUnits !== 1 ? 's' : ''})</span>
                  <span>{formatPrice(totals.originalTotal)}</span>
                </div>

                {totals.breakdown.map((b, i) => (
                  <div key={i} className="aprende-cart-summary-row aprende-cart-promo-row">
                    <span><Sparkles size={13} /> {b.label}</span>
                    <span>{formatPrice(b.amount)}</span>
                  </div>
                ))}

                {totals.savings > 0 && (
                  <div className="aprende-cart-savings">
                    Estás ahorrando {formatPrice(totals.savings)}
                  </div>
                )}

                <div className="aprende-cart-summary-total">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>

                <p className="aprende-cart-hint">{nextPromoHint(totals.totalUnits)}</p>

                <div style={{ margin: '4px 0 14px' }}>
                  <UrgencyCountdown compact />
                </div>

                <Link href="/aprende/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Ir a checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
