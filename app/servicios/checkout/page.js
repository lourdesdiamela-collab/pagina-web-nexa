'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ShieldCheck, Zap, CreditCard, Landmark, Copy, Check, TimerReset, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TransferReservationTimer from '@/components/aprende/TransferReservationTimer';
import { formatPrice } from '@/lib/products.mjs';

const WHATSAPP_NUMBER = '5491124527402';

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

const TRANSFER_CBU = '0170132240000011323248';
const TRANSFER_ALIAS = 'FUROR.ATUN.INCLINABA';
const TRANSFER_TITULAR = 'Alarcón Lourdes';

function ServicioCheckoutContent() {
  const searchParams = useSearchParams();

  const servicio = searchParams.get('servicio') || '';
  const planName = searchParams.get('planName') || '';
  const line = searchParams.get('line') || '';
  const amount = Number(searchParams.get('amount') || 0);
  const billing = searchParams.get('billing') === 'unico' ? 'unico' : 'mensual';

  const planLabel = [planName, line].filter(Boolean).join(' — ') || 'Plan NEXA';
  const billingText = billing === 'unico' ? 'Pago único' : 'Primer pago — mes 1 (plan mensual)';
  const estimatedTransferTotal = Math.round(amount * 0.9);

  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [paymentMethod, setPaymentMethod] = useState(null); // 'mercadopago' | 'transfer'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devMessage, setDevMessage] = useState('');
  const [transferOrder, setTransferOrder] = useState(null); // { reference, total }

  const missingPlan = !amount || amount <= 0;
  const formValid = form.name.trim() && form.email.trim() && form.phone.trim();

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildPayload() {
    return {
      ...form,
      servicio,
      planLabel,
      amount,
      billing,
    };
  }

  async function handlePayMercadoPago() {
    setError('');
    setDevMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/servicio-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
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
      setDevMessage(data.message || 'Mercado Pago todavía no está activo. Probá con transferencia bancaria.');
      setLoading(false);
    } catch {
      setError('No pudimos iniciar el pago. Intentá de nuevo.');
      setLoading(false);
    }
  }

  async function handleConfirmTransfer() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/servicio-transferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No pudimos registrar tu pedido.');
        setLoading(false);
        return;
      }
      setTransferOrder({ reference: data.reference, total: data.total });
      setLoading(false);
    } catch {
      setError('No pudimos registrar tu pedido. Intentá de nuevo.');
      setLoading(false);
    }
  }

  const waText = encodeURIComponent(`Hola NEXA! Quiero contratar el plan ${planLabel}. ¿Cómo seguimos con el pago?`);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 720 }}>
          <Link href="/servicios" className="aprende-back-link">
            <ArrowLeft size={14} /> Volver a servicios
          </Link>

          <div className="section-header" style={{ textAlign: 'left', marginBottom: 20 }}>
            <span className="section-tag">Checkout</span>
            <h1 className="section-title" style={{ marginBottom: 0 }}>Contratar servicio</h1>
          </div>

          {missingPlan ? (
            <div className="aprende-cart-empty">
              <p>No encontramos el plan que buscás. Volvé a Servicios y elegí un plan.</p>
              <Link href="/servicios" className="btn btn-primary">Ver planes y precios</Link>
            </div>
          ) : transferOrder ? (
            <div className="aprende-checkout-summary">
              <div className="aprende-form-success" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  ¡Pedido #{transferOrder.reference.slice(-8)} registrado! Te enviamos un email de confirmación.
                  Hacé la transferencia por <strong>{formatPrice(transferOrder.total)}</strong> con los datos de arriba —
                  en breve verificamos el ingreso y nos contactamos para coordinar el arranque.
                </span>
              </div>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
                <MessageCircle size={16} /> Avisar por WhatsApp que ya transferí
              </a>
            </div>
          ) : (
            <div className="aprende-checkout-summary">
              <h3>Resumen de tu pedido</h3>
              <div className="aprende-cart-summary-row">
                <span>{planLabel}</span>
                <span>{formatPrice(amount)}</span>
              </div>
              <div className="aprende-cart-summary-total">
                <span>Total</span>
                <span>{formatPrice(amount)}</span>
              </div>
              <p className="aprende-cart-hint" style={{ marginTop: 8 }}>{billingText}</p>
              {billing === 'mensual' && (
                <p className="aprende-cart-hint">
                  Este pago corresponde al primer mes. La renovación de los meses siguientes la coordinamos directamente con vos.
                </p>
              )}

              <div style={{ marginTop: 20 }}>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="aprende-field">
                    <label htmlFor="name">Nombre y Apellido *</label>
                    <input id="name" value={form.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Ej: Juan Pérez" disabled={loading} />
                  </div>
                  <div className="aprende-field">
                    <label htmlFor="phone">Teléfono / WhatsApp *</label>
                    <input id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+54 9 11 1234 5678" disabled={loading} />
                  </div>
                </div>
                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="aprende-field">
                    <label htmlFor="email">Email *</label>
                    <input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="juan@empresa.com" disabled={loading} />
                  </div>
                  <div className="aprende-field">
                    <label htmlFor="company">Empresa / Negocio (opcional)</label>
                    <input id="company" value={form.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Nombre de tu marca" disabled={loading} />
                  </div>
                </div>

                {!formValid && (
                  <p className="aprende-cart-hint" style={{ marginBottom: 14 }}>Completá tus datos de contacto para continuar con el pago.</p>
                )}

                <div className="aprende-payment-copy">
                  Aceptamos <strong>tarjeta de crédito, débito y transferencia bancaria</strong>.
                  Pagando por transferencia tenés <strong>10% de descuento</strong> automático sobre el total.
                </div>

                {error && <div className="aprende-form-error" style={{ marginBottom: 12 }}>{error}</div>}
                {devMessage && <div className="aprende-form-error" style={{ marginBottom: 12 }}>{devMessage}</div>}

                <div className="aprende-payment-methods">
                  <button
                    type="button"
                    className={`aprende-payment-option${paymentMethod === 'mercadopago' ? ' active' : ''}`}
                    onClick={() => setPaymentMethod('mercadopago')}
                    disabled={!formValid}
                  >
                    <CreditCard size={18} /> Mercado Pago — tarjeta, débito o dinero en cuenta
                  </button>
                  <button
                    type="button"
                    className={`aprende-payment-option${paymentMethod === 'transfer' ? ' active' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                    disabled={!formValid}
                  >
                    <Landmark size={18} /> Transferencia bancaria — 10% OFF ({formatPrice(estimatedTransferTotal)})
                  </button>
                </div>

                {paymentMethod === 'mercadopago' && formValid && (
                  <div style={{ marginTop: 16 }}>
                    <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePayMercadoPago} disabled={loading}>
                      <Zap size={16} /> {loading ? 'Redirigiendo…' : 'Pagar con Mercado Pago'}
                    </button>
                    <p className="aprende-cart-hint" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={14} /> Pago seguro procesado por Mercado Pago.
                    </p>
                  </div>
                )}

                {paymentMethod === 'transfer' && formValid && (
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
                      Al confirmar, registramos tu pedido y te enviamos un email. En breve verificamos el ingreso y nos contactamos para coordinar el arranque.
                    </p>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#25D366', fontWeight: 700, fontSize: '0.9rem', justifyContent: 'center' }}>
                  <MessageCircle size={16} /> ¿Preferís coordinar el pago por WhatsApp?
                </a>
                <Link href={`/contacto?servicio=${servicio}`} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  ¿Todavía tenés dudas? Pedí tu diagnóstico gratis sin pagar
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ServicioCheckoutPage() {
  return (
    <Suspense fallback={null}>
      <ServicioCheckoutContent />
    </Suspense>
  );
}
