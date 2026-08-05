'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, MessageCircle, ShieldCheck, Zap, FlaskConical } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/components/aprende/CartContext';
import { formatPrice } from '@/lib/products.mjs';

const WHATSAPP_NUMBER = '5491124527402';

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { items, totals, isLoaded, resolveProduct, catalogLoaded, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOrder, setDevOrder] = useState(null); // { orderId } cuando MP no está configurado

  const resolved = items
    .map((item) => ({ item, product: resolveProduct(item.slug) }))
    .filter((r) => r.product);

  const summaryText = resolved.map(({ item, product }) => `- ${product.title} x${item.qty}`).join('\n');
  const whatsappMessage = encodeURIComponent(
    `Hola! Quiero comprar estos recursos de NEXA Aprende:\n${summaryText}\n\nTotal estimado: ${formatPrice(totals.total)}`
  );

  async function handlePay() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, couponCode: couponCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No pudimos iniciar el pago.');
        setLoading(false);
        return;
      }
      if (data.mpConfigured && data.initPoint) {
        window.location.href = data.initPoint;
        return;
      }
      setDevOrder({ orderId: data.orderId });
      setLoading(false);
    } catch {
      setError('No pudimos iniciar el pago. Intentá de nuevo.');
      setLoading(false);
    }
  }

  async function handleSimulate() {
    if (!devOrder) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: devOrder.orderId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No pudimos simular el pago.');
        setLoading(false);
        return;
      }
      clearCart();
      window.location.href = `/aprende/checkout/success?order_id=${devOrder.orderId}`;
    } catch {
      setError('No pudimos simular el pago.');
      setLoading(false);
    }
  }

  const isAuthed = sessionStatus === 'authenticated';
  const authLoading = sessionStatus === 'loading';

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 720 }}>
          <Link href="/aprende/carrito" className="aprende-back-link">
            <ArrowLeft size={14} /> Volver al carrito
          </Link>

          <div className="section-header" style={{ textAlign: 'left', marginBottom: 20 }}>
            <span className="section-tag">Checkout</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Finalizar compra</h1>
          </div>

          {isLoaded && catalogLoaded && !authLoading && resolved.length === 0 && (
            <div className="aprende-cart-empty">
              <p>Tu carrito está vacío.</p>
              <Link href="/aprende" className="btn btn-primary">Ver catálogo</Link>
            </div>
          )}

          {isLoaded && catalogLoaded && !authLoading && resolved.length > 0 && (
            <div className="aprende-checkout-summary">
              <h3>Resumen de tu pedido</h3>
              {resolved.map(({ item, product }) => (
                <div key={product.slug} className="aprende-cart-summary-row">
                  <span>{product.title} × {item.qty}</span>
                  <span>{formatPrice(product.price * item.qty)}</span>
                </div>
              ))}
              {totals.savings > 0 && (
                <div className="aprende-cart-savings">Ahorro con promos: {formatPrice(totals.savings)}</div>
              )}
              <div className="aprende-cart-summary-total">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>

              {!isAuthed ? (
                <div style={{ marginTop: 20 }}>
                  <div className="aprende-form-error" style={{ marginBottom: 12 }}>
                    Necesitás una cuenta para comprar (así asociamos la compra y las descargas a vos).
                  </div>
                  <Link href="/aprende/cuenta/login?callbackUrl=/aprende/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }}>
                    Iniciar sesión
                  </Link>
                  <Link href="/aprende/cuenta/registro?callbackUrl=/aprende/checkout" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                    Crear cuenta gratis
                  </Link>
                </div>
              ) : (
                <div style={{ marginTop: 20 }}>
                  <div className="aprende-field" style={{ marginBottom: 14 }}>
                    <label htmlFor="coupon">Cupón (opcional)</label>
                    <input id="coupon" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Ej: BIENVENIDA10" />
                  </div>

                  {error && <div className="aprende-form-error" style={{ marginBottom: 12 }}>{error}</div>}

                  {!devOrder ? (
                    <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePay} disabled={loading}>
                      <Zap size={16} /> {loading ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
                    </button>
                  ) : (
                    <div>
                      <div className="aprende-form-success" style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <FlaskConical size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span>
                          Mercado Pago todavía no está configurado (falta que Lu cargue sus credenciales). Este es el <strong>modo de prueba</strong>:
                          simulá el pago aprobado para ver el flujo completo (pedido, email, Mis Recursos) funcionando de verdad.
                        </span>
                      </div>
                      <button type="button" className="btn btn-lima" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSimulate} disabled={loading}>
                        {loading ? 'Procesando…' : 'Simular pago aprobado (modo desarrollo)'}
                      </button>
                    </div>
                  )}

                  <p className="aprende-cart-hint" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={14} /> Pago seguro procesado por Mercado Pago.
                  </p>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
                  >
                    <MessageCircle size={16} /> Prefiero coordinar por WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
