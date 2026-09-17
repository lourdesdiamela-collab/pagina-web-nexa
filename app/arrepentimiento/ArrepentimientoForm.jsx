'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const CAMPOS_INICIALES = { nombre: '', email: '', telefono: '', identificacionCompra: '', motivo: '' };

export default function ArrepentimientoForm() {
  const [formData, setFormData] = useState(CAMPOS_INICIALES);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | { tipo: 'success', numero } | { tipo: 'error', mensaje }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/arrepentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ tipo: 'error', mensaje: data.error || 'Ocurrió un error. Probá de nuevo.' });
        return;
      }
      setStatus({ tipo: 'success', numero: data.numero });
      setFormData(CAMPOS_INICIALES);
    } catch {
      setStatus({ tipo: 'error', mensaje: 'Ocurrió un error de conexión. Probá de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  if (status?.tipo === 'success') {
    return (
      <div style={{ background: 'rgba(210,242,58,0.08)', border: '1px solid rgba(210,242,58,0.2)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
        <CheckCircle2 size={32} style={{ color: '#D2F23A', marginBottom: 8 }} />
        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#E2F57D', marginBottom: 6 }}>
          Solicitud recibida — trámite N° {status.numero}
        </p>
        <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>
          Te mandamos la constancia por email con este número. Guardalo para cualquier consulta sobre el estado de tu pedido.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form-pro" style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 24,
      padding: 'clamp(24px, 5vw, 40px)',
    }}>
      {status?.tipo === 'error' && (
        <div style={{ background: 'rgba(255,107,107,0.08)', color: '#ff9b9b', padding: 20, borderRadius: 16, fontWeight: 700, border: '1px solid rgba(255,107,107,0.2)', textAlign: 'center', marginBottom: 20 }}>
          {status.mensaje}
        </div>
      )}

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="arr-nombre">Nombre y Apellido *</label>
          <input id="arr-nombre" type="text" placeholder="Ej: Juan Pérez" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required disabled={loading} />
        </div>
        <div className="form-field">
          <label htmlFor="arr-telefono">Teléfono (opcional)</label>
          <input id="arr-telefono" type="tel" placeholder="+54 9 11 1234 5678" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} disabled={loading} />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="arr-email">Email *</label>
        <input id="arr-email" type="email" placeholder="juan@empresa.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading} />
      </div>

      <div className="form-field">
        <label htmlFor="arr-identificacion">Identificación de la compra o contratación *</label>
        <input
          id="arr-identificacion"
          type="text"
          placeholder="Número de pedido/referencia (ej: SRV-ABC123) o una descripción de qué compraste y cuándo"
          value={formData.identificacionCompra}
          onChange={(e) => setFormData({ ...formData, identificacionCompra: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="arr-motivo">Motivo (opcional)</label>
        <textarea id="arr-motivo" placeholder="Contanos por qué te querés arrepentir de la compra..." value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} disabled={loading} />
      </div>

      <button type="submit" className="btn-submit" disabled={loading} style={{ opacity: loading ? 0.65 : 1 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Send size={16} /> {loading ? 'Enviando solicitud...' : 'Enviar solicitud de arrepentimiento'}
        </span>
      </button>
      <p style={{ fontSize: '0.74rem', color: '#6B7280', textAlign: 'center', marginTop: 12 }}>
        Al enviar vas a recibir un email con tu número de trámite.
      </p>
    </form>
  );
}
