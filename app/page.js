'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const SERVICES = [
  { title: 'Estrategia y marketing', desc: 'Plan comercial y contenido orientado a resultados concretos.' },
  { title: 'Campañas de captación', desc: 'Meta y Google Ads con foco en ventas y rentabilidad real.' },
  { title: 'CRM y seguimiento', desc: 'Procesos claros para no perder leads ni oportunidades.' },
];

const CLIENTS = ['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estética Funcional', 'Aqualaf'];

/* Scroll fade-in hook */
function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeUp({ children, className = '', style = {}, as: Tag = 'div' }) {
  const ref = useFadeUp();
  return <Tag ref={ref} className={`fade-up ${className}`} style={style}>{children}</Tag>;
}

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', service: 'marketing_integral', challenge: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

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
      setFormData({ name: '', email: '', company: '', phone: '', service: 'marketing_integral', challenge: '' });
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

      <main>
        {/* ── Hero ── */}
        <section style={{ paddingTop: 'clamp(110px, 14vw, 160px)', paddingBottom: 'clamp(60px, 8vw, 100px)', background: 'linear-gradient(165deg, #FAF8FC 0%, #F0E8F6 50%, #E8DDF4 100%)', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative blurred orbs */}
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '60%', height: '80%', background: 'radial-gradient(circle, rgba(184,155,255,0.2) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '40%', height: '60%', background: 'radial-gradient(circle, rgba(210,242,58,0.1) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-grid">
              <div>
                <FadeUp>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '8px 16px', border: '1px solid rgba(184,155,255,0.3)', background: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>
                    <Sparkles size={14} color="#835CE6" />
                    <span style={{ fontWeight: 700, color: '#835CE6', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Equipo NEXA</span>
                  </div>
                </FadeUp>
                <FadeUp>
                  <h1 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.06, color: '#12141D' }}>
                    Marketing, ventas y procesos en una misma plataforma.
                  </h1>
                </FadeUp>
                <FadeUp>
                  <p style={{ marginTop: 18, color: '#505466', fontSize: 'clamp(1rem, 1.8vw, 1.12rem)', maxWidth: 560, lineHeight: 1.7 }}>
                    Te ayudamos a crecer con estrategia clara, ejecución consistente y seguimiento real de cada cliente.
                  </p>
                </FadeUp>
                <FadeUp>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                    <Link href="/contacto" className="btn btn-primary">Quiero una auditoría <ArrowRight size={16} /></Link>
                    <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
                  </div>
                </FadeUp>
              </div>
              <FadeUp>
                <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 24px 64px rgba(13,14,21,0.12)' }}>
                  <img src="/nexa-hero-new.png" alt="Equipo NEXA trabajando en estrategia digital" style={{ width: '100%', display: 'block' }} />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── Clients Strip ── */}
        <section style={{ background: '#0D0E15', padding: 'clamp(40px, 6vw, 64px) 0' }}>
          <div className="container">
            <FadeUp>
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.78rem', marginBottom: 20 }}>
                Marcas que confían en NEXA
              </p>
            </FadeUp>
            <FadeUp>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                {CLIENTS.map((name) => (
                  <div key={name} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
                    {name}
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Services Preview ── */}
        <section style={{ background: '#0D0E15', padding: '0 0 clamp(40px, 6vw, 64px)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {SERVICES.map((service, i) => (
                <FadeUp key={service.title}>
                  <article style={{ borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', padding: '28px 24px', transition: 'all 0.4s', cursor: 'default' }}>
                    <h2 style={{ margin: 0, color: 'white', fontSize: '1.15rem', fontWeight: 800 }}>{service.title}</h2>
                    <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.6 }}>{service.desc}</p>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact Form ── */}
        <section style={{ background: '#0D0E15', paddingBottom: 'clamp(60px, 10vw, 100px)' }}>
          <div className="container">
            <FadeUp>
              <div style={{ borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', padding: 'clamp(24px, 4vw, 40px)' }}>
                <div className="contact-form-grid">
                  <div>
                    <h2 style={{ margin: 0, color: 'white', fontSize: 'clamp(1.6rem, 3vw, 2rem)', fontWeight: 800 }}>Contanos tu desafío</h2>
                    <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: 12, fontSize: '0.95rem', lineHeight: 1.7 }}>
                      Te respondemos por mail con una propuesta clara de siguiente paso.
                    </p>
                    <div style={{ marginTop: 20, display: 'grid', gap: 10 }}>
                      {['Respuesta personalizada', 'Seguimiento comercial claro', 'Sin formularios de adorno'].map((item) => (
                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>
                          <CheckCircle2 size={16} color="#D2F23A" /> {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={submit} className="contact-form-pro">
                    {status === 'ok' && (
                      <div style={{ borderRadius: 12, border: '1px solid rgba(210,242,58,0.35)', background: 'rgba(210,242,58,0.08)', color: '#E2F57D', padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>
                        ✓ Mensaje enviado. Te contactaremos pronto.
                      </div>
                    )}
                    {status === 'error' && (
                      <div style={{ borderRadius: 12, border: '1px solid rgba(255,107,107,0.35)', background: 'rgba(255,107,107,0.08)', color: '#ffd8d8', padding: '12px 16px', fontWeight: 600, fontSize: '0.9rem' }}>
                        Ocurrió un error. Intentalo de nuevo.
                      </div>
                    )}
                    <div className="form-row">
                      <div className="form-field">
                        <label>Nombre</label>
                        <input required value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Nombre y apellido" />
                      </div>
                      <div className="form-field">
                        <label>Email</label>
                        <input required type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="tu@email.com" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label>Empresa</label>
                        <input required value={formData.company} onChange={(e) => updateField('company', e.target.value)} placeholder="Tu marca o negocio" />
                      </div>
                      <div className="form-field">
                        <label>Teléfono</label>
                        <input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="WhatsApp" />
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Servicio</label>
                      <select value={formData.service} onChange={(e) => updateField('service', e.target.value)}>
                        <option value="marketing_integral">Marketing integral</option>
                        <option value="redes_sociales">Redes sociales</option>
                        <option value="meta_ads">Campañas Meta/Google</option>
                        <option value="crm_estructuras">CRM y orden digital</option>
                        <option value="nexa_recover">NEXA Recover</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>¿Qué querés mejorar?</label>
                      <textarea required value={formData.challenge} onChange={(e) => updateField('challenge', e.target.value)} placeholder="Contanos brevemente tu desafío..." />
                    </div>
                    <button type="submit" disabled={sending} className="btn-submit" style={{ opacity: sending ? 0.7 : 1 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Send size={16} /> {sending ? 'Enviando...' : 'Enviar consulta'}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }
          .hero-grid > div:first-child { order: 1; }
          .hero-grid > div:last-child { order: 0; max-width: 420px; margin: 0 auto; }
          .hero-grid .fade-up div[style*="flex"] { justify-content: center; }
          .contact-form-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }
      `}} />
    </>
  );
}
