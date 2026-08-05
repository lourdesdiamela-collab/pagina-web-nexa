'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className="aprende-newsletter">
      <div className="aprende-newsletter-icon"><Mail size={24} /></div>
      <h3>Recursos nuevos, directo a tu mail</h3>
      <p>Sumate para enterarte antes que nadie de guías nuevas, ofertas y packs de categoría.</p>
      {submitted ? (
        <div className="aprende-newsletter-success">
          <CheckCircle2 size={18} /> Listo, ya estás suscripto con {email}.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="aprende-newsletter-form">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="btn btn-lima btn-sm">Suscribirme</button>
        </form>
      )}
      <span className="aprende-newsletter-note">Simulación local — sin envío real de emails (Fase 2).</span>
    </div>
  );
}
