'use client';

import { useState } from 'react';

const campo = {
  width: '100%', height: 52, padding: '0 16px', fontSize: '1rem', color: '#12141D', background: '#FAF8FC',
  border: '1px solid #CFC5E3', borderRadius: 12, outline: 'none',
};

export default function CrearClaveForm({ token, email }) {
  const [clave, setClave] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setError('');
    if (clave.length < 8) return setError('Usá al menos 8 caracteres.');
    if (clave !== repetir) return setError('Las dos contraseñas no coinciden.');
    setEnviando(true);
    try {
      const r = await fetch('/api/aprende/crear-clave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: clave }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return setError(d.error || 'No pudimos guardar tu contraseña.');
      setListo(true);
    } catch {
      setError('No hay conexión. Probá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  if (listo) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ margin: '0 0 8px', color: '#12141D' }}>¡Listo! Tu cuenta está lista</h2>
        <p style={{ color: '#3A3E50', fontSize: '1.05rem', lineHeight: 1.6 }}>Ya podés entrar con <strong>{email}</strong> y tu contraseña para ver tus kits.</p>
        <a className="btn btn-primary" href="/aprende/cuenta/login?callbackUrl=%2Faprende%2Fmis-recursos" style={{ marginTop: 12 }}>Entrar a mis recursos</a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} style={{ display: 'grid', gap: 16 }}>
      <p style={{ margin: 0, color: '#3A3E50', fontSize: '1.05rem', lineHeight: 1.6 }}>
        Elegí una contraseña para entrar con <strong>{email}</strong> y tener tus kits siempre a mano.
      </p>
      <label style={{ display: 'grid', gap: 6, fontWeight: 600, color: '#12141D' }}>
        Contraseña (mínimo 8 caracteres)
        <input type="password" autoComplete="new-password" value={clave} onChange={(e) => setClave(e.target.value)} style={campo} required minLength={8} />
      </label>
      <label style={{ display: 'grid', gap: 6, fontWeight: 600, color: '#12141D' }}>
        Repetí la contraseña
        <input type="password" autoComplete="new-password" value={repetir} onChange={(e) => setRepetir(e.target.value)} style={campo} required minLength={8} />
      </label>
      {error && <p role="alert" style={{ margin: 0, padding: '12px 14px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C' }}>{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar contraseña'}</button>
    </form>
  );
}
