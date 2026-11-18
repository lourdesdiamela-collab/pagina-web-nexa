'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OlvideClavePage() {
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState({ cargando: false, error: '', mensaje: '' });

  async function enviar(e) {
    e.preventDefault();
    setEstado({ cargando: true, error: '', mensaje: '' });
    try {
      const res = await fetch('/api/aprende/olvide-clave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) setEstado({ cargando: false, error: data.error || 'No pudimos enviar el mail.', mensaje: '' });
      else setEstado({ cargando: false, error: '', mensaje: data.mensaje });
    } catch {
      setEstado({ cargando: false, error: 'Error de conexión. Probá de nuevo.', mensaje: '' });
    }
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80 }}>
          <div className="aprende-auth-card">
            <h1>Recuperá tu contraseña</h1>
            <p>Escribí el mail con el que compraste y te mandamos un enlace para elegir una contraseña nueva.</p>
            {estado.mensaje ? (
              <div className="aprende-form-success" style={{ padding: '14px 16px', borderRadius: 12, background: '#EEF9D0', color: '#12141D', lineHeight: 1.5 }}>
                {estado.mensaje}
              </div>
            ) : (
              <form className="aprende-form" onSubmit={enviar}>
                {estado.error && <div className="aprende-form-error">{estado.error}</div>}
                <div className="aprende-field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={estado.cargando}>
                  <Mail size={16} /> {estado.cargando ? 'Enviando…' : 'Enviarme el enlace'}
                </button>
              </form>
            )}
            <div className="aprende-auth-switch">
              <Link href="/aprende/cuenta/login">Volver a ingresar</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
