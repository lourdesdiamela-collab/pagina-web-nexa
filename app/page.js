'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import StatsDashboard from '@/components/StatsDashboard';

const SERVICES = [
  {
    title: 'Estrategia y marketing',
    desc: 'Plan comercial y de contenido construido sobre datos reales de audiencia y desempeño, no solo intuición.',
    // Placeholder de Unsplash — reemplazar por foto real de NEXA cuando esté disponible.
    img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=70',
    alt: 'Equipo analizando estrategia y datos de audiencia',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="#fff" />
      </svg>
    ),
  },
  {
    title: 'Campañas de captación',
    desc: 'Meta y Google Ads optimizadas con métricas de conversión — sabés qué canal vende, no solo qué canal gasta.',
    img: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=600&q=70',
    alt: 'Planificación de campañas de captación en redes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="19" x2="5" y2="13" />
        <line x1="12" y1="19" x2="12" y2="8" />
        <line x1="19" y1="19" x2="19" y2="4" />
      </svg>
    ),
  },
  {
    title: 'CRM, datos y reporting',
    desc: 'Dashboards y reportes claros que muestran en qué etapa está cada lead — y qué mover para cerrar más.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=70',
    alt: 'Dashboard de reporting y CRM con métricas en vivo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <polyline points="6,14 10,9 13,12 18,7" />
      </svg>
    ),
  },
];

/*
  Testimonios/casos — copys e imágenes de ejemplo aprobados en el mockup
  (nexa-rediseno-propuesta.html v3). Las fotos son placeholders de Unsplash;
  reemplazar por material real de cada cliente cuando esté disponible.
  El rótulo "— ejemplo" ya NO se muestra en pantalla (a pedido de Lu), pero
  los textos/cifras siguen siendo de ejemplo hasta confirmar contenido real
  de cada cliente.
*/
const TESTIMONIALS = [
  {
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=70',
    imgAlt: 'Caso Ciudad Moto',
    quote: 'Pasamos de improvisar a tener un proceso comercial claro. El equipo de NEXA entendió el negocio rápido.',
    metric: '▲ +340% ventas en 90 días',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=70',
    avatarAlt: 'Dueño de Ciudad Moto',
    name: 'Ciudad Moto',
    role: 'Cliente NEXA',
  },
  {
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=70',
    imgAlt: 'Caso Roca Viviendas',
    quote: 'El CRM nos ordenó la captación de propiedades. Ahora sabemos exactamente en qué etapa está cada lead.',
    metric: '▲ +58% leads calificados',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=70',
    avatarAlt: 'Responsable de Roca Viviendas',
    name: 'Roca Viviendas',
    role: 'Cliente NEXA',
  },
  {
    img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=70',
    imgAlt: 'Caso Estética Funcional',
    quote: 'Mejoró nuestra imagen de marca y empezamos a convertir mejor con el mismo presupuesto.',
    metric: '▲ +2.4x conversión, mismo budget',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=70',
    avatarAlt: 'Dueña de Estética Funcional',
    name: 'Estética Funcional',
    role: 'Cliente NEXA',
  },
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
                    <span style={{ fontWeight: 700, color: '#835CE6', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Agencia de growth, CRM &amp; datos</span>
                  </div>
                </FadeUp>
                <FadeUp>
                  <h1 style={{ margin: 0, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.06, color: '#12141D' }}>
                    Marketing, ventas y procesos en una misma plataforma.
                  </h1>
                </FadeUp>
                <FadeUp>
                  <p style={{ marginTop: 18, color: '#505466', fontSize: 'clamp(1rem, 1.8vw, 1.12rem)', maxWidth: 560, lineHeight: 1.7 }}>
                    Te ayudamos a crecer con estrategia clara, ejecución consistente y datos reales de cada canal y cliente — para decidir con números, no solo con intuición.
                  </p>
                </FadeUp>
                <FadeUp>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                    <Link href="/contacto" className="btn btn-primary">Quiero una auditoría <ArrowRight size={16} /></Link>
                    <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
                  </div>
                </FadeUp>
                <FadeUp>
                  <div className="home-proof-row">
                    <div className="home-proof-item"><div className="home-proof-num">+20</div><div className="home-proof-label">marcas asesoradas</div></div>
                    <div className="home-proof-item"><div className="home-proof-num">+340%</div><div className="home-proof-label">venta en caso destacado</div></div>
                    <div className="home-proof-item"><div className="home-proof-num">3x</div><div className="home-proof-label">ROI promedio</div></div>
                  </div>
                </FadeUp>
              </div>
              <FadeUp>
                <div className="home-hero-visual">
                  <div className="home-hero-img-wrap">
                    <img src="/nexa-hero-new.png" alt="Equipo NEXA trabajando en estrategia digital" style={{ width: '100%', display: 'block' }} />
                  </div>
                  <div className="home-float-chip home-chip-stat">
                    <div className="home-chip-dot"><span></span><span></span><span></span></div>
                    <div><div className="home-chip-num">+340%</div><div className="home-chip-lbl">ventas — Ciudad Moto</div></div>
                  </div>
                  <div className="home-float-chip home-chip-quote">
                    <div className="home-chip-stars">★★★★★</div>
                    <p>&quot;Encontramos orden real en nuestro proceso comercial.&quot;</p>
                  </div>
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

        {/* ── Stats / Data dashboard ── */}
        <StatsDashboard />

        {/* ── Services Preview (con imágenes) ── */}
        <section className="home-services-section">
          <div className="container">
            <FadeUp>
              <div className="section-header">
                <span className="section-tag">Qué hacemos</span>
                <h2 className="section-title">Todo lo que tu marca necesita para crecer</h2>
                <p className="section-subtitle" style={{ margin: '0 auto' }}>Estrategia, ejecución y datos — en un mismo equipo.</p>
              </div>
            </FadeUp>
            <div className="home-services-grid">
              {SERVICES.map((service) => (
                <FadeUp key={service.title}>
                  <article className="home-service-card">
                    <div className="home-service-img-wrap">
                      {/* Placeholder de Unsplash — reemplazar por foto real de NEXA */}
                      <img src={service.img} alt={service.alt} loading="lazy" />
                      <div className="home-service-icon">{service.icon}</div>
                    </div>
                    <div className="home-service-body">
                      <h3>{service.title}</h3>
                      <p>{service.desc}</p>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonios / Casos ── */}
        <section className="home-testimonials-section">
          <div className="container">
            <FadeUp>
              <div className="section-header">
                <span
                  className="section-tag"
                  style={{ background: 'rgba(210,242,58,0.1)', color: '#D2F23A', border: '1px solid rgba(210,242,58,0.2)' }}
                >
                  Lo dicen nuestros clientes
                </span>
                <h2 className="section-title text-white">Resultados que se sienten (y se miden)</h2>
                <p className="section-subtitle text-white-50" style={{ margin: '0 auto' }}>
                  Casos reales de NEXA — métricas y testimonios a confirmar y actualizar con cada cliente.
                </p>
              </div>
            </FadeUp>
            <div className="home-t-grid">
              {TESTIMONIALS.map((t) => (
                <FadeUp key={t.name}>
                  <article className="home-t-card">
                    <div className="home-t-img-wrap">
                      {/* Placeholder de Unsplash — reemplazar por foto real del caso */}
                      <img src={t.img} alt={t.imgAlt} loading="lazy" />
                    </div>
                    <div className="home-t-body">
                      <div className="home-t-mark">&quot;</div>
                      <p className="home-t-quote">{t.quote}</p>
                      <div className="home-t-metric">{t.metric}</div>
                      <div className="home-t-person">
                        {/* Placeholder de Unsplash — reemplazar por foto real del cliente */}
                        <img className="home-t-avatar-img" src={t.avatar} alt={t.avatarAlt} loading="lazy" />
                        <div>
                          <div className="home-t-name">{t.name}</div>
                          <div className="home-t-role">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cierre ── */}
        <section className="home-closing-section">
          <div className="container">
            <FadeUp>
              <h2 className="home-closing-title">¿Listos para llevar tu marca al siguiente nivel?</h2>
              <p className="home-closing-text">Contanos tu desafío y te respondemos con una propuesta clara de siguiente paso — con métricas, no solo promesas.</p>
              <Link href="/contacto" className="btn btn-primary">Quiero una auditoría <ArrowRight size={16} /></Link>
            </FadeUp>
            <FadeUp>
              <div className="home-closing-img-wrap">
                {/* Placeholder de Unsplash — reemplazar por foto real del equipo NEXA */}
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=75" alt="Equipo NEXA trabajando junto a un cliente" loading="lazy" />
                <div className="home-closing-chip"><span className="home-stars-mini">★★★★★</span> +20 marcas ya confían en NEXA</div>
              </div>
            </FadeUp>
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

        /* ── Hero proof row ── */
        .home-proof-row { display: flex; gap: 0; flex-wrap: wrap; margin-top: 32px; align-items: center; }
        .home-proof-item { padding: 0 20px; border-right: 1px solid rgba(18,20,29,0.12); }
        .home-proof-item:first-child { padding-left: 0; }
        .home-proof-item:last-child { border-right: none; }
        .home-proof-num { font-size: 1.3rem; font-weight: 800; color: #12141D; letter-spacing: -0.02em; }
        .home-proof-label { font-size: 0.74rem; color: #828699; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }

        /* ── Hero visual + floating chips ── */
        .home-hero-visual { position: relative; }
        .home-hero-img-wrap { border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.5); box-shadow: 0 24px 64px rgba(13,14,21,0.12); }
        .home-float-chip {
          position: absolute; background: #fff; border-radius: 18px; padding: 16px 18px;
          box-shadow: 0 20px 48px rgba(13,14,21,0.16); border: 1px solid rgba(255,255,255,0.8);
        }
        .home-chip-stat { left: -20px; bottom: -22px; display: flex; align-items: center; gap: 12px; }
        .home-chip-num { font-size: 1.5rem; font-weight: 900; color: #835CE6; letter-spacing: -0.02em; }
        .home-chip-lbl { font-size: 0.72rem; color: #828699; font-weight: 600; max-width: 90px; line-height: 1.3; }
        .home-chip-dot { width: 36px; height: 36px; border-radius: 10px; background: #0D0E15; flex-shrink: 0; display: flex; align-items: flex-end; justify-content: center; gap: 3px; padding: 7px 6px; }
        .home-chip-dot span { flex: 1; border-radius: 2px; background: var(--gradient-lima); }
        .home-chip-dot span:nth-child(1) { height: 35%; }
        .home-chip-dot span:nth-child(2) { height: 65%; }
        .home-chip-dot span:nth-child(3) { height: 100%; }
        .home-chip-quote { right: -16px; top: -18px; max-width: 200px; }
        .home-chip-stars { color: var(--lima); font-size: 0.7rem; letter-spacing: 2px; margin-bottom: 6px; }
        .home-chip-quote p { font-size: 0.82rem; font-weight: 600; color: #12141D; line-height: 1.4; }

        /* ── Services preview (home) ── */
        .home-services-section { padding: clamp(72px, 9vw, 120px) 0; background: #fff; }
        .home-services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .home-service-card {
          background: var(--bg-main); border: 1px solid rgba(184,155,255,0.16); border-radius: 26px;
          padding: 0; overflow: hidden; transition: all 0.5s cubic-bezier(.16,1,.3,1);
        }
        .home-service-card:hover { transform: translateY(-8px); background: #fff; border-color: transparent; box-shadow: 0 30px 64px rgba(184,155,255,0.18); }
        .home-service-img-wrap { position: relative; height: 172px; overflow: hidden; }
        .home-service-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(.16,1,.3,1); }
        .home-service-card:hover .home-service-img-wrap img { transform: scale(1.07); }
        .home-service-icon {
          position: absolute; top: 16px; left: 16px; width: 44px; height: 44px; border-radius: 13px;
          background: rgba(13,14,21,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.22);
        }
        .home-service-icon svg { width: 22px; height: 22px; }
        .home-service-body { padding: 30px 32px 34px; }
        .home-service-body h3 { font-size: 1.18rem; margin-bottom: 10px; }
        .home-service-body p { color: var(--text-body); font-size: 0.96rem; line-height: 1.65; }

        /* ── Testimonials (home) ── */
        .home-testimonials-section { padding: clamp(64px, 9vw, 100px) 0; background: #0D0E15; }
        .home-t-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
        .home-t-card {
          background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); border-radius: 22px;
          padding: 0; overflow: hidden; transition: transform 0.5s cubic-bezier(.16,1,.3,1);
        }
        .home-t-card:hover { transform: translateY(-6px); }
        .home-t-img-wrap { height: 168px; overflow: hidden; }
        .home-t-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(.16,1,.3,1); }
        .home-t-card:hover .home-t-img-wrap img { transform: scale(1.06); }
        .home-t-body { padding: 28px 28px 32px; }
        .home-t-mark { font-size: 2.4rem; font-weight: 900; color: var(--lima); line-height: 1; margin-bottom: 6px; }
        .home-t-quote { font-size: 0.98rem; color: rgba(255,255,255,0.82); line-height: 1.6; margin-bottom: 18px; }
        .home-t-metric {
          display: inline-flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 800; color: var(--lima);
          background: rgba(210,242,58,0.08); border: 1px solid rgba(210,242,58,0.2); padding: 6px 14px; border-radius: 100px; margin-bottom: 20px;
        }
        .home-t-person { display: flex; align-items: center; gap: 12px; }
        .home-t-avatar-img { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; flex-shrink: 0; border: 2px solid rgba(255,255,255,0.18); }
        .home-t-name { font-weight: 700; font-size: 0.88rem; color: #fff; }
        .home-t-role { font-size: 0.78rem; color: rgba(255,255,255,0.45); }

        /* ── Closing (home) ── */
        .home-closing-section { padding: clamp(64px, 9vw, 100px) 0; background: var(--bg-soft); text-align: center; }
        .home-closing-title { font-size: clamp(2rem, 4vw, 3rem); max-width: 680px; margin: 0 auto 18px; }
        .home-closing-text { color: var(--text-body); max-width: 520px; margin: 0 auto 36px; font-size: 1.05rem; }
        .home-closing-img-wrap {
          position: relative; max-width: 880px; margin: 48px auto 0; border-radius: 28px; overflow: hidden;
          box-shadow: 0 30px 70px rgba(13,14,21,0.14);
        }
        .home-closing-img-wrap img { width: 100%; height: 320px; object-fit: cover; display: block; }
        .home-closing-chip {
          position: absolute; left: 24px; bottom: 24px; background: #fff; padding: 13px 22px; border-radius: 100px;
          font-size: 0.86rem; font-weight: 700; color: #12141D; box-shadow: 0 14px 32px rgba(13,14,21,0.18);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .home-stars-mini { color: var(--lima); letter-spacing: 1px; }

        @media (max-width: 1024px) {
          .home-services-grid, .home-t-grid { grid-template-columns: repeat(2, 1fr); }
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
          .home-proof-row { justify-content: center; }
          .home-services-grid, .home-t-grid { grid-template-columns: 1fr; }
          .home-closing-img-wrap img { height: 220px; }
          .home-closing-chip { left: 14px; bottom: 14px; padding: 10px 16px; font-size: 0.78rem; }
        }
      `}} />
    </>
  );
}
