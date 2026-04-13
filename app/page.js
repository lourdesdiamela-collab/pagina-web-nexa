'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const SERVICES = [
  { title: 'Estrategia y marketing', desc: 'Plan comercial y contenido orientado a resultados.' },
  { title: 'Campanas de captacion', desc: 'Meta y Google Ads con foco en ventas y rentabilidad.' },
  { title: 'CRM y seguimiento', desc: 'Procesos claros para no perder leads ni oportunidades.' },
];

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: 'marketing_integral',
    challenge: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo enviar');
      setStatus('ok');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: 'marketing_integral',
        challenge: '',
      });
    } catch {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main style={{ background: 'linear-gradient(180deg, #f2ecf8 0%, #f6f2fb 40%, #0d0e15 40%, #0d0e15 100%)' }}>
        <section style={{ paddingTop: 'clamp(100px, 12vw, 140px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 30, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '8px 14px', border: '1px solid rgba(184,155,255,0.38)', background: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>
                <Sparkles size={14} color="#835CE6" />
                <span style={{ fontWeight: 700, color: '#5f3bbd', fontSize: '0.82rem' }}>Equipo NEXA</span>
              </div>
              <h1 style={{ margin: 0, fontSize: 'clamp(2.1rem, 4.2vw, 4rem)', lineHeight: 1.04, color: '#101222' }}>
                Marketing, ventas y procesos en una misma plataforma.
              </h1>
              <p style={{ marginTop: 14, color: '#4b5168', fontSize: '1.08rem', maxWidth: 620 }}>
                Te ayudamos a crecer con estrategia clara, ejecucion consistente y seguimiento real de cada cliente.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                <Link href="/contacto" className="btn btn-primary">Quiero una auditoria <ArrowRight size={16} /></Link>
                <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
              </div>
            </div>
            <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 30px 60px rgba(13,14,21,0.2)' }}>
              <img src="/nexa-hero-new.png" alt="Equipo NEXA" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </section>

        <section style={{ background: '#0d0e15', color: 'white', paddingBottom: 80 }}>
          <div className="container">
            <p style={{ margin: 0, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Marcas y Equipo NEXA trabajando en una sola direccion
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 18 }}>
              {['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estetica Funcional', 'Aqualaf'].map((name) => (
                <div key={name} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', textAlign: 'center' }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ background: '#0d0e15', paddingBottom: 80 }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {SERVICES.map((service) => (
              <article key={service.title} style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', padding: 16 }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>{service.title}</h2>
                <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>{service.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ background: '#0d0e15', paddingBottom: 110 }}>
          <div className="container">
            <div style={{ borderRadius: 22, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
                <div>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '2rem' }}>Contanos tu desafio</h2>
                  <p style={{ color: 'rgba(255,255,255,0.64)', marginTop: 10 }}>
                    Te respondemos por mail con una propuesta clara de siguiente paso.
                  </p>
                  <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                    {['Respuesta personalizada', 'Seguimiento comercial claro', 'Sin formularios de adorno'].map((item) => (
                      <div key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.75)' }}>
                        <CheckCircle2 size={16} color="#D2F23A" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
                  {status === 'ok' && (
                    <div style={{ borderRadius: 10, border: '1px solid rgba(210,242,58,0.45)', background: 'rgba(210,242,58,0.12)', color: '#f3ffb5', padding: '10px 12px', fontWeight: 600 }}>
                      Mensaje enviado. Te contactaremos pronto.
                    </div>
                  )}
                  {status === 'error' && (
                    <div style={{ borderRadius: 10, border: '1px solid rgba(255,107,107,0.45)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8', padding: '10px 12px', fontWeight: 600 }}>
                      Ocurrio un error al enviar. Intentalo de nuevo.
                    </div>
                  )}
                  <div className="form-row">
                    <input required value={formData.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Nombre y apellido" style={fieldStyle} />
                    <input required type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Email" style={fieldStyle} />
                  </div>
                  <div className="form-row">
                    <input required value={formData.company} onChange={(event) => updateField('company', event.target.value)} placeholder="Empresa" style={fieldStyle} />
                    <input value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="Telefono / WhatsApp" style={fieldStyle} />
                  </div>
                  <select value={formData.service} onChange={(event) => updateField('service', event.target.value)} style={fieldStyle}>
                    <option value="marketing_integral">Marketing integral</option>
                    <option value="redes_sociales">Redes sociales</option>
                    <option value="meta_ads">Campanas Meta/Google</option>
                    <option value="crm_estructuras">CRM y orden digital</option>
                    <option value="nexa_recover">NEXA Recover</option>
                  </select>
                  <textarea required value={formData.challenge} onChange={(event) => updateField('challenge', event.target.value)} placeholder="Que queres mejorar hoy" style={{ ...fieldStyle, minHeight: 120, resize: 'vertical' }} />
                  <button type="submit" disabled={sending} className="btn btn-primary" style={{ width: '100%', opacity: sending ? 0.75 : 1 }}>
                    {sending ? 'Enviando...' : 'Enviar consulta'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const fieldStyle = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.16)',
  background: 'rgba(255,255,255,0.06)',
  color: 'white',
  padding: '10px 12px',
};
