'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowLeft, ShieldCheck, Zap, FlaskConical, CreditCard, Landmark, Copy, Check, TimerReset } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/components/aprende/CartContext';
import TransferReservationTimer from '@/components/aprende/TransferReservationTimer';
import UrgencyCountdown from '@/components/aprende/UrgencyCountdown';
import { formatPrice } from '@/lib/products.mjs';

const TRANSFER_CBU = '0170132240000011323248';
const TRANSFER_ALIAS = 'FUROR.ATUN.INCLINABA';
const TRANSFER_TITULAR = 'Alarcón Lourdes';

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* si el navegador bloquea el clipboard, el usuario igual puede seleccionar el texto */
    }
  }

  return (
    <div className="aprende-transfer-row">
      <span>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <strong>{value}</strong>
        <button type="button" className="aprende-copy-btn" onClick={handleCopy}>
          {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { items, totals, isLoaded, resolveProduct, catalogLoaded, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOrder, setDevOrder] = useState(null); // { orderId } cuando MP no está configurado
  const [paymentMethod, setPaymentMethod] = useState(null); // 'mercadopago' | 'transfer'
  const [transferOrder, setTransferOrder] = useState(null); // { orderId, total } cuando ya se registró el pedido por transferencia

  const resolved = items
    .map((item) => ({ item, product: resolveProduct(item.slug) }))
    .filter((r) => r.product);

  const estimatedTransferTotal = Math.round(totals.total * 0.9);

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

  async function handleConfirmTransfer() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/bank-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, couponCode: couponCode || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No pudimos registrar tu pedido.');
        setLoading(false);
        return;
      }
      setTransferOrder({ orderId: data.orderId, total: data.total });
      clearCart();
      setLoading(false);
    } catch {
      setError('No pudimos registrar tu pedido. Intentá de nuevo.');
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

          {isLoaded && catalogLoaded && !authLoading && resolved.length === 0 && !transferOrder && (
            <div className="aprende-cart-empty">
              <p>Tu carrito está vacío.</p>
              <Link href="/aprende" className="btn btn-primary">Ver catálogo</Link>
            </div>
          )}

          {transferOrder ? (
            <div className="aprende-checkout-summary">
              <div className="aprende-form-success" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  ¡Pedido #{transferOrder.orderId.slice(-8).toUpperCase()} registrado! Te enviamos un email de confirmación.
                  Hacé la transferencia por <strong>{formatPrice(transferOrder.total)}</strong> con los datos de arriba —
                  en breve verificamos el pago y nos contactamos para enviarte el material.
                </span>
              </div>
              <Link href="/aprende/mis-recursos" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                Ver mis recursos
              </Link>
            </div>
          ) : (
            isLoaded && catalogLoaded && !authLoading && resolved.length > 0 && (
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

                <div style={{ marginTop: 14 }}>
                  <UrgencyCountdown compact />
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

                    <div className="aprende-payment-copy">
                      Aceptamos <strong>tarjeta de crédito, débito y transferencia bancaria</strong>.
                      Pagando por transferencia tenés <strong>10% de descuento</strong> automático sobre el total.
                    </div>

                    {error && <div className="aprende-form-error" style={{ marginBottom: 12 }}>{error}</div>}

                    <div className="aprende-payment-methods">
                      <button
                        type="button"
                        className={`aprende-payment-option${paymentMethod === 'mercadopago' ? ' active' : ''}`}
                        onClick={() => setPaymentMethod('mercadopago')}
                      >
                        <CreditCard size={18} /> Mercado Pago — tarjeta, débito o dinero en cuenta
                      </button>
                      <button
                        type="button"
                        className={`aprende-payment-option${paymentMethod === 'transfer' ? ' active' : ''}`}
                        onClick={() => setPaymentMethod('transfer')}
                      >
                        <Landmark size={18} /> Transferencia bancaria — 10% OFF ({formatPrice(estimatedTransferTotal)})
                      </button>
                    </div>

                    {paymentMethod === 'mercadopago' && (
                      <div style={{ marginTop: 16 }}>
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
                      </div>
                    )}

                    {paymentMethod === 'transfer' && (
                      <div className="aprende-transfer-box">
                        <p style={{ fontSize: '0.86rem', fontWeight: 700, marginBottom: 10 }}>Transferí a esta cuenta:</p>
                        <CopyField label="CBU" value={TRANSFER_CBU} />
                        <CopyField label="Alias" value={TRANSFER_ALIAS} />
                        <div className="aprende-transfer-row">
                          <span>Titular</span>
                          <strong>{TRANSFER_TITULAR}</strong>
                        </div>
                        <div className="aprende-transfer-row">
                          <span>Monto a transferir</span>
                          <strong>{formatPrice(estimatedTransferTotal)}</strong>
                        </div>

                        <TransferReservationTimer />

                        <button
                          type="button"
                          className="btn btn-lima"
                          style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}
                          onClick={handleConfirmTransfer}
                          disabled={loading}
                        >
                          <TimerReset size={16} /> {loading ? 'Registrando…' : 'Ya transferí, confirmar pedido'}
                        </button>
                        <p className="aprende-cart-hint" style={{ marginTop: 10 }}>
                          Al confirmar, registramos tu pedido y te enviamos un email. En breve verificamos el ingreso y nos contactamos para enviarte el material.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
