'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Lock, Loader2 } from 'lucide-react';

const tarjeta = { background: '#fff', border: '1px solid #E9E2F3', borderRadius: 20, padding: 'clamp(20px, 4vw, 30px)', boxShadow: '0 12px 40px rgba(131,92,230,0.10)' };
const etiqueta = { display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '1rem', color: '#12141D' };
const campo = { width: '100%', height: 50, borderRadius: 12, border: '1px solid #CFC5E3', background: '#FAF8FC', padding: '0 14px', fontSize: '1rem', color: '#12141D', outline: 'none' };

export default function CompraKitClient({ kit, mpListo, falloPago, waLink }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [email2, setEmail2] = useState('');
  const [acepto, setAcepto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(falloPago ? 'El pago no se completó. Podés intentarlo de nuevo cuando quieras.' : '');

  async function pagar(e) {
    e.preventDefault();
    setError('');
    if (email.trim().toLowerCase() !== email2.trim().toLowerCase()) {
      setError('Los dos emails no coinciden. Revisalos para que el kit te llegue bien.');
      return;
    }
    setCargando(true);
    try {
      const r = await fetch('/api/checkout/kit-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kit: kit.slug, name, email, acceptedTerms: acepto }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.initPoint) {
        window.location.href = d.initPoint;
        return;
      }
      setError(d.error || 'No pudimos iniciar el pago. Probá de nuevo.');
    } catch {
      setError('No pudimos conectarnos. Revisá tu internet y probá de nuevo.');
    }
    setCargando(false);
  }

  return (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'start' }}>
      <section style={tarjeta} aria-label="Resumen">
        <p style={{ margin: 0, color: '#835CE6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Kit IA</p>
        <h2 style={{ margin: '6px 0 12px', fontSize: '1.5rem', lineHeight: 1.2 }}>{kit.titulo}</h2>
        <p style={{ margin: '0 0 16px', fontSize: '2rem', fontWeight: 800, color: '#12141D' }}>
          {kit.precioTexto} <small style={{ fontSize: '1rem', fontWeight: 500, color: '#505466' }}>pago único</small>
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          {[...kit.archivos, 'Acceso por 60 días desde el enlace del mail'].map((t) => (
            <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: '#3A3E50', fontSize: '1.02rem' }}>
              <Check size={20} color="#5c6a12" style={{ flexShrink: 0, marginTop: 2 }} /> {t}
            </li>
          ))}
        </ul>
        <p style={{ margin: '18px 0 0', color: '#505466', fontSize: '0.92rem', lineHeight: 1.55 }}>
          Es contenido orientativo: te da método y herramientas, no promete resultados de ventas.
        </p>
      </section>

      <section style={tarjeta} aria-label="Datos de compra">
        {mpListo ? (
          <form onSubmit={pagar} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="k-name" style={etiqueta}>Tu nombre</label>
              <input id="k-name" style={campo} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="k-email" style={etiqueta}>Tu email (acá te llega el kit)</label>
              <input id="k-email" type="email" inputMode="email" style={campo} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="k-email2" style={etiqueta}>Repetí tu email</label>
              <input id="k-email2" type="email" inputMode="email" style={campo} value={email2} onChange={(e) => setEmail2(e.target.value)} autoComplete="off" required />
            </div>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 18, fontSize: '0.98rem', color: '#3A3E50', lineHeight: 1.5, cursor: 'pointer' }}>
              <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} style={{ width: 20, height: 20, marginTop: 2, flexShrink: 0 }} />
              <span>
                Acepto los <Link href="/terminos" target="_blank" style={{ color: '#6B3FD4', fontWeight: 600 }}>Términos y Condiciones</Link> y
                la <Link href="/privacidad" target="_blank" style={{ color: '#6B3FD4', fontWeight: 600 }}>Política de Privacidad</Link>. Sé que puedo
                pedir el arrepentimiento dentro de los 10 días (<Link href="/arrepentimiento" target="_blank" style={{ color: '#6B3FD4', fontWeight: 600 }}>botón de arrepentimiento</Link>).
              </span>
            </label>
            {error && (
              <div role="alert" style={{ marginBottom: 16, padding: '12px 14px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', fontSize: '0.98rem' }}>{error}</div>
            )}
            <button type="submit" className="btn btn-lima" disabled={cargando || !acepto || !name || !email || !email2}
              style={{ width: '100%', justifyContent: 'center', height: 54, fontSize: '1.05rem', opacity: cargando || !acepto || !name || !email || !email2 ? 0.6 : 1 }}>
              {cargando ? <><Loader2 size={18} /> Te llevamos a Mercado Pago…</> : <><Lock size={18} /> Pagar {kit.precioTexto} con Mercado Pago</>}
            </button>
            <p style={{ margin: '12px 0 0', textAlign: 'center', color: '#505466', fontSize: '0.9rem' }}>Pago seguro. Tus datos de tarjeta los maneja Mercado Pago, nosotros nunca los vemos.</p>
          </form>
        ) : (
          <div>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem' }}>El pago online todavía no está disponible</h2>
            <p style={{ margin: '0 0 16px', color: '#3A3E50', lineHeight: 1.6 }}>Escribinos por WhatsApp y te ayudamos a comprar el kit con transferencia.</p>
            <a className="btn btn-lima" href={waLink} style={{ width: '100%', justifyContent: 'center' }}>Escribir por WhatsApp</a>
          </div>
        )}
      </section>
    </div>
  );
}
