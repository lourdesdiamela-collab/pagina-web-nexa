'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, BarChart3, Target, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const InstaIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function Home() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      {/* Hero */}
      <section className="hero">
        <div className="hero-deco-circle hero-deco-1" />
        <div className="hero-deco-circle hero-deco-2" />
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <Sparkles size={16} color="#B89BFF" />
                <span className="text-gradient">Estrategia · Marketing · Crecimiento</span>
              </div>
              <h1 className="hero-title">
                Hacemos que tu marca se vea mejor, comunique mejor y crezca con <span className="text-gradient">dirección.</span>
              </h1>
              <p className="hero-desc">
                En NEXA trabajamos estrategia, contenido, campañas y crecimiento para marcas y negocios que quieren construir una presencia más sólida y generar mejores resultados.
              </p>
              <div className="hero-actions">
                <Link href="/contacto" className="btn btn-primary">Hablemos de tu marca <ArrowRight size={18} /></Link>
                <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
              </div>
            </div>
            <div className="hero-visual">
              <div className="video-wrapper" style={{ overflow: 'hidden', position: 'relative', borderRadius: '32px', height: '100%', minHeight: '400px', border: '1px solid rgba(184, 155, 255, 0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <img src="/nexa-hero-new.png" alt="NEXA Strategy Visual" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                <div className="video-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(13,14,21,0.2), rgba(13,14,21,0.5))', pointerEvents: 'none' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Hub: NEXA Recover */}
      <section style={{ background: 'linear-gradient(to bottom, #0D0E15, #08090C)', padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120vw', height: '120vw', background: 'radial-gradient(circle, rgba(210, 242, 58, 0.03) 0%, rgba(13,14,21,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <span className="section-tag" style={{ background: 'rgba(210, 242, 58, 0.1)', color: '#D2F23A', borderColor: 'rgba(210, 242, 58, 0.2)' }}>Tu Hub de Inteligencia</span>
            <h2 className="section-title text-white">Centralizá y escalá con <span style={{ color: '#D2F23A' }}>NEXA Recover.</span></h2>
            <p className="section-subtitle" style={{ margin: '20px auto', maxWidth: '800px' }}>
              No solo atraemos nuevos clientes; reactivamos tu base inactiva y automatizamos tu crecimiento para que nunca pierdas una oportunidad de venta.
            </p>
          </div>

          <div className="recover-grid">
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-30px', background: 'radial-gradient(circle, rgba(184, 155, 255, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
              <div style={{ position: 'relative', borderRadius: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
                <img src="/nexa-recover.png" alt="NEXA Recover Hub Interface" style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,14,21,0.8), transparent)' }} />
              </div>
            </div>
            
            <div className="recover-content">
              <div style={{ display: 'grid', gap: '30px' }}>
                {[
                  { title: 'Reactivación Inteligente', desc: 'Convertimos clientes inactivos en compradores recurrentes mediante flujos automatizados.', icon: RefreshCw },
                  { title: 'Métricas que Importan', desc: 'Visualizá el ROAS real, LTV y tasa de retención en un solo tablero intuitivo.', icon: BarChart3 },
                  { title: 'Fidelización Proactiva', desc: 'Sistemas que detectan cuándo un cliente está por irse y actúan de inmediato.', icon: Target }
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flexShrink: 0, width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(210, 242, 58, 0.1)', border: '1px solid rgba(210, 242, 58, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D2F23A' }}>
                      <f.icon size={24} />
                    </div>
                    <div>
                      <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>{f.title}</h4>
                      <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '50px' }}>
                <Link href="/contacto" className="btn btn-primary" style={{ background: '#D2F23A', color: '#0D0E15' }}>Explorar el Hub de Marketing</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="clients">
        <div className="container">
          <p className="clients-label">Marcas que confiaron en NEXA</p>
          <div className="clients-row">
            {['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estética Funcional', 'Aqualaf'].map(name => (
              <span key={name} className="client-logo">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about">
        <div className="container">
          <div className="about-grid">
            <div>
              <span className="about-tag">¿Quiénes somos?</span>
              <h2 className="about-title">Tu estudio estratégico de marketing y crecimiento.</h2>
              <p className="about-text">
                En NEXA combinamos estrategia, contenido, campañas y seguimiento para ayudar a marcas y negocios a crecer con más claridad, mejor imagen y mejores resultados.<br /><br />
                No hacemos marketing por hacer: construimos marcas con dirección.
              </p>
              <div className="about-pills">
                {['Estrategia', 'Campañas', 'Contenido', 'Redes Sociales', 'Ventas', 'Crecimiento'].map(p => (
                  <span key={p} className="pill">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <img src="/nexa-hero-new.png" alt="NEXA Studio" style={{ width: '100%', borderRadius: '32px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Services Summary */}
      <section className="services" style={{ paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="section-tag">Nuestras áreas</span>
              <h2 className="section-title">Soluciones para crecer</h2>
            </div>
            <Link href="/servicios" className="btn btn-outline" style={{ marginBottom: '20px' }}>Ver todos los servicios <ArrowRight size={16}/></Link>
          </div>
          <div className="services-grid">
            {[
              { icon: BarChart3, title: 'Marketing & Estrategia', desc: 'Planes accionables para posicionar tu marca.' },
              { icon: InstaIcon, title: 'Redes Sociales', desc: 'Contenido y gestión para construir comunidad.' },
              { icon: Target, title: 'Campañas y Captación', desc: 'Publicidad en Meta/Google para captar clientes.' },
            ].map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-icon"><s.icon size={28} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" style={{ background: '#0D0E15', padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '48px', padding: 'clamp(24px, 5vw, 80px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(184, 155, 255, 0.1) 0%, transparent 70%)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: '80px', alignItems: 'center' }} className="contact-grid">
              <div>
                <span className="section-tag">Hablemos hoy</span>
                <h2 className="section-title text-white" style={{ fontSize: '3.5rem', lineHeight: 1 }}>¿Listos para <span className="text-gradient">escalar?</span></h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', margin: '30px 0 50px' }}>
                  Completá el formulario y nos pondremos en contacto para coordinar una reunión diagnóstica de tu marca.
                </p>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', fontWeight: 600 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(184, 155, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B89BFF' }}>
                      <Target size={20} />
                    </div>
                    hola@nexaarg.com
                  </div>
                </div>
              </div>
              
              <form action="mailto:hola@nexaarg.com" method="post" encType="text/plain" style={{ display: 'grid', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input type="text" name="name" placeholder="Tu nombre" required style={{ width: '100%', padding: '18px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                  <input type="email" name="email" placeholder="Tu email" required style={{ width: '100%', padding: '18px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                </div>
                <input type="text" name="subject" placeholder="Asunto / Marca" required style={{ width: '100%', padding: '18px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none' }} />
                <textarea name="message" placeholder="¿En qué podemos ayudarte?" required style={{ width: '100%', padding: '18px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', outline: 'none', minHeight: '150px', resize: 'vertical' }} />
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.1rem' }}>Enviar Mensaje</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
