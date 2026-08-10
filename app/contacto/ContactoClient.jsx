'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Send, MessageCircle, CheckCircle2, Star, Quote } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const BENEFITS = [
  'Diagnóstico de marketing y redes sin cargo',
  'Análisis de tu competencia y tu marca',
  'Plan de acción personalizado, sin compromiso',
];

function ContactFormSection() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', service: '', challenge: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Prefill del servicio y el plan elegido cuando llega desde un CTA de /servicios
  // (?servicio=slug&plan=Growth%20—%20NEXA%20Social%20($219.900/mes))
  useEffect(() => {
    const servicio = searchParams.get('servicio');
    const plan = searchParams.get('plan');
    if (servicio || plan) {
      setFormData((prev) => ({
        ...prev,
        service: servicio || prev.service,
        challenge: plan ? `Plan de interés: ${plan}` : prev.challenge,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setStatus('success');
      setFormData({ name: '', company: '', email: '', phone: '', service: '', challenge: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main style={{ paddingTop: 'clamp(100px, 12vw, 140px)', background: '#0D0E15', minHeight: '100vh' }}>
        {/* Header */}
        <section style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="container" style={{ maxWidth: 700 }}>
            <span className="section-tag" style={{ background: 'rgba(210,242,58,0.1)', color: '#D2F23A', border: '1px solid rgba(210,242,58,0.2)' }}>Contacto</span>
            <h1 className="section-title text-white">Hablemos de tu <span className="text-gradient">marca.</span></h1>
            <p className="section-subtitle text-white-50">
              Si estás listo para profesionalizar tu marketing, ordenar tu captura de leads y escalar tu negocio, dejá tus datos y nuestro equipo se comunicará con vos.
            </p>
          </div>
        </section>

        {/* Form + trust sidebar */}
        <section style={{ paddingBottom: 'clamp(60px, 10vw, 120px)' }}>
          <div className="container" style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div className="contacto-grid">
              {/* Sidebar: prueba social + beneficios + urgencia */}
              <div className="contacto-sidebar">
                <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.35)', marginBottom: 24 }}>
                  <img src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1400&q=80" alt="Equipo de NEXA conversando sobre estrategia con un cliente" loading="lazy" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', left: 18, bottom: 18, background: '#fff', padding: '10px 18px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 700, color: '#12141D', boxShadow: '0 14px 32px rgba(13,14,21,0.18)' }}>Te respondemos en menos de 24 horas</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                  {BENEFITS.map((b) => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#CBD5E1', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={18} style={{ color: '#D2F23A', flexShrink: 0 }} />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: 16, marginBottom: 24 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>+8 empresas esta semana</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>ya solicitaron su diagnóstico</div>
                  </div>
                </div>

                <div style={{ padding: 22, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#D2F23A" color="#D2F23A" />)}
                  </div>
                  <Quote size={18} style={{ color: 'rgba(184,155,255,0.4)', marginBottom: 6 }} />
                  <p style={{ fontSize: '0.87rem', color: '#CBD5E1', lineHeight: 1.7, marginBottom: 14 }}>
                    &ldquo;En 3 meses, NEXA duplicó nuestras ventas online. El seguimiento de clientes que armaron cambió totalmente la forma en que trabajamos.&rdquo;
                  </p>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Martina González</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>CEO · Boutique Aurea</div>
                </div>
              </div>

              {/* Form */}
              <div>
                <form onSubmit={handleSubmit} className="contact-form-pro" style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24,
                  padding: 'clamp(24px, 5vw, 40px)',
                }}>
                  {status === 'success' && (
                    <div style={{ background: 'rgba(210,242,58,0.08)', color: '#E2F57D', padding: 20, borderRadius: 16, fontWeight: 700, border: '1px solid rgba(210,242,58,0.2)', textAlign: 'center' }}>
                      ✓ ¡Mensaje enviado! Nos comunicaremos con vos a la brevedad.
                    </div>
                  )}
                  {status === 'error' && (
                    <div style={{ background: 'rgba(255,107,107,0.08)', color: '#ff9b9b', padding: 20, borderRadius: 16, fontWeight: 700, border: '1px solid rgba(255,107,107,0.2)', textAlign: 'center' }}>
                      Ocurrió un error. Podés contactarnos por <a href="https://wa.me/5491124527402" target="_blank" rel="noreferrer" style={{ color: '#25D366', textDecoration: 'underline' }}>WhatsApp</a>.
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-field">
                      <label>Nombre y Apellido *</label>
                      <input type="text" placeholder="Ej: Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={loading} />
                    </div>
                    <div className="form-field">
                      <label>Teléfono / WhatsApp *</label>
                      <input type="tel" placeholder="+54 9 11 1234 5678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required disabled={loading} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Email *</label>
                      <input type="email" placeholder="juan@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={loading} />
                    </div>
                    <div className="form-field">
                      <label>Empresa / Negocio (opcional)</label>
                      <input type="text" placeholder="Nombre de tu marca" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} disabled={loading} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Servicio de interés *</label>
                    <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} required disabled={loading}>
                      <option value="" disabled>Seleccioná una opción...</option>
                      <option value="nexa_web">NEXA Web (sitio web)</option>
                      <option value="marketing_integral">Marketing & Estrategia Integral</option>
                      <option value="redes_sociales">Redes Sociales y Contenido (NEXA Social)</option>
                      <option value="meta_ads">Campañas Meta / Google Ads (NEXA Ads)</option>
                      <option value="crm_seguimiento">CRM y Seguimiento Comercial</option>
                      <option value="orden_digital">Orden Digital y Estructura de Marca</option>
                      <option value="nexa_recover">NEXA Recover</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Desafío principal (opcional)</label>
                    <textarea placeholder="Contanos brevemente qué te gustaría mejorar..." value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} disabled={loading} />
                  </div>
                  <button type="submit" className="btn-submit" disabled={loading} style={{ opacity: loading ? 0.65 : 1 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <Send size={16} /> {loading ? 'Enviando solicitud...' : 'Quiero mi diagnóstico gratis'}
                    </span>
                  </button>
                  <p style={{ fontSize: '0.74rem', color: '#6B7280', textAlign: 'center', marginTop: 12 }}>
                    Sin compromiso. Tus datos solo se usan para contactarte por este diagnóstico.
                  </p>
                </form>

                {/* WhatsApp fallback */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <a href="https://wa.me/5491124527402" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#25D366', fontWeight: 700, fontSize: '0.9rem' }}>
                    <MessageCircle size={16} /> ¿Preferís escribirnos por WhatsApp?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <style dangerouslySetInnerHTML={{ __html: `
        .contacto-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: 40px; align-items: start; }
        @media (max-width: 900px) {
          .contacto-grid { grid-template-columns: 1fr; }
          .contacto-sidebar { order: 2; }
        }
      ` }} />
    </>
  );
}

export default function ContactoClient() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <Suspense fallback={null}>
        <ContactFormSection />
      </Suspense>
      <Footer />
    </>
  );
}
