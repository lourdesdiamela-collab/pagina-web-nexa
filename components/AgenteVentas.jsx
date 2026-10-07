'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/track';

/*
 * Chat del agente de ventas (ver lib/salesAgent.js y /api/agente-ventas).
 *
 * Solo aparece si el servidor dice que está habilitado (ANTHROPIC_API_KEY
 * cargada en Vercel). No se muestra en el panel de admin ni en el checkout,
 * para no distraer en el momento del pago.
 */

const SALUDO = 'Hola, soy el asesor de NEXA. Contame un poco de tu negocio y qué te gustaría mejorar (ventas, consultas, redes, anuncios o web) y te recomiendo el plan que mejor te sirve.';
const OCULTO_EN = ['/aprende/admin', '/servicios/checkout'];

// Convierte links del texto (del sitio o /wa) en enlaces clickeables, sin HTML crudo.
function conLinks(texto) {
  const partes = String(texto).split(/(https?:\/\/[^\s)]+|\/wa\?[^\s)]+)/g);
  return partes.map((parte, i) => {
    if (/^(https?:\/\/|\/wa\?)/.test(parte)) {
      let href = parte.replace(/[.,;:]+$/, '');
      try {
        const url = new URL(href, window.location.origin);
        const propio = url.host === window.location.host || /(^|\.)nexagrowth\.com\.ar$/.test(url.host);
        if (!propio) return <span key={i}>{parte}</span>;
        href = url.host === window.location.host ? `${url.pathname}${url.search}` : url.toString();
      } catch {
        return <span key={i}>{parte}</span>;
      }
      const esCheckout = href.includes('/servicios/checkout');
      const esWhatsApp = href.startsWith('/wa');
      return (
        <a
          key={i}
          href={href}
          target={esWhatsApp ? '_blank' : undefined}
          rel={esWhatsApp ? 'noopener noreferrer' : undefined}
          onClick={() => { if (esCheckout) track('agente_checkout_click', { href }); }}
          style={{ color: '#6D4AD6', fontWeight: 600, textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {esCheckout ? 'Ir al pago del plan' : esWhatsApp ? 'Escribir por WhatsApp' : href}
        </a>
      );
    }
    return <span key={i}>{parte}</span>;
  });
}

export default function AgenteVentas() {
  const pathname = usePathname() || '';
  const [habilitado, setHabilitado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([{ role: 'assistant', content: SALUDO }]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const finRef = useRef(null);

  useEffect(() => {
    let cancelado = false;
    fetch('/api/agente-ventas')
      .then((r) => r.json())
      .then((d) => { if (!cancelado) setHabilitado(Boolean(d.enabled)); })
      .catch(() => {});
    return () => { cancelado = true; };
  }, []);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, abierto]);

  if (!habilitado || OCULTO_EN.some((p) => pathname.startsWith(p))) return null;

  async function enviar(e) {
    e.preventDefault();
    const contenido = texto.trim();
    if (!contenido || enviando) return;
    const nuevos = [...mensajes, { role: 'user', content: contenido }];
    setMensajes(nuevos);
    setTexto('');
    setEnviando(true);
    if (nuevos.filter((m) => m.role === 'user').length === 1) track('agente_primer_mensaje', { page_path: pathname });
    try {
      const res = await fetch('/api/agente-ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // El saludo inicial es fijo del navegador: no se manda al modelo.
        body: JSON.stringify({ messages: nuevos.slice(1) }),
      });
      const data = await res.json().catch(() => ({}));
      setMensajes((prev) => [...prev, { role: 'assistant', content: data.reply || 'Perdón, no pude responder. Probá de nuevo.' }]);
    } catch {
      setMensajes((prev) => [...prev, { role: 'assistant', content: 'Se cortó la conexión. Probá de nuevo o escribinos por WhatsApp: /wa?from=agente_ventas_error' }]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      {abierto && (
        <div
          role="dialog"
          aria-label="Chat con el asesor de NEXA"
          style={{
            position: 'fixed', right: 20, bottom: 176, width: 'min(380px, calc(100vw - 32px))',
            height: 'min(520px, calc(100vh - 220px))', background: '#ffffff', color: '#1a1530',
            borderRadius: 18, boxShadow: '0 20px 60px rgba(40, 20, 90, 0.25)', zIndex: 10000,
            display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e6e0f5',
          }}
        >
          <div style={{ padding: '14px 16px', background: '#6D4AD6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ display: 'block', fontSize: 15 }}>Asesor NEXA</strong>
              <span style={{ fontSize: 12, opacity: 0.85 }}>Asistente con IA · te responde al instante</span>
            </div>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar chat" style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, background: '#faf8ff' }}>
            {mensajes.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%', padding: '10px 12px', borderRadius: 14, fontSize: 14, lineHeight: 1.45,
                  whiteSpace: 'pre-wrap',
                  background: m.role === 'user' ? '#6D4AD6' : '#ffffff',
                  color: m.role === 'user' ? '#ffffff' : '#1a1530',
                  border: m.role === 'user' ? 'none' : '1px solid #e6e0f5',
                }}
              >
                {m.role === 'assistant' ? conLinks(m.content) : m.content}
              </div>
            ))}
            {enviando && <div style={{ alignSelf: 'flex-start', fontSize: 13, color: '#6b6585' }}>Escribiendo…</div>}
            <div ref={finRef} />
          </div>
          <form onSubmit={enviar} style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid #e6e0f5', background: '#fff' }}>
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribí tu consulta…"
              maxLength={1500}
              aria-label="Tu mensaje"
              style={{ flex: 1, border: '1px solid #d9d2ee', borderRadius: 10, padding: '10px 12px', fontSize: 14, color: '#1a1530', background: '#fff' }}
            />
            <button type="submit" disabled={enviando || !texto.trim()} style={{ background: '#6D4AD6', color: '#fff', border: 0, borderRadius: 10, padding: '0 14px', fontWeight: 600, cursor: 'pointer', opacity: enviando || !texto.trim() ? 0.6 : 1 }}>
              Enviar
            </button>
          </form>
          <p style={{ margin: 0, padding: '0 12px 10px', fontSize: 11, color: '#6b6585', background: '#fff' }}>
            Respuestas generadas con IA. Para casos puntuales te deriva con el equipo.
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => { setAbierto((v) => !v); if (!abierto) track('agente_abierto', { page_path: pathname }); }}
        aria-label={abierto ? 'Cerrar chat con el asesor' : 'Abrir chat con el asesor'}
        style={{
          position: 'fixed', right: 30, bottom: 104, width: 60, height: 60, borderRadius: '50%',
          background: '#6D4AD6', color: '#fff', border: 0, cursor: 'pointer', zIndex: 9999,
          boxShadow: '0 10px 30px rgba(109, 74, 214, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </>
  );
}
