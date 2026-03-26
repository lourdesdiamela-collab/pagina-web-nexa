'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, BarChart3, Target } from 'lucide-react';
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
              <div className="video-wrapper" style={{ overflow: 'hidden', position: 'relative', borderRadius: '32px', height: '100%', minHeight: '400px' }}>
                <img src="/nexa-hero.png" alt="NEXA Hero Art" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
                <div className="video-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(184, 155, 255, 0.3), rgba(13,14,21,0.5))', pointerEvents: 'none' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEXA Recover - SaaS Launch Promo */}
      <section style={{ background: '#0D0E15', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vw', background: 'radial-gradient(circle, rgba(210, 242, 58, 0.05) 0%, rgba(13,14,21,0) 70%)', zIndex: 0, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '60px', alignItems: 'center' }} className="recover-grid">
            
            <div style={{ order: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(210, 242, 58, 0.1)', color: '#D2F23A', padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '24px' }}>
                <span style={{ width: 8, height: 8, background: '#D2F23A', borderRadius: '50%', boxShadow: '0 0 10px #D2F23A' }} /> Lanzamiento Oficial
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-0.03em' }}>
                Descubrí <span style={{ color: '#D2F23A' }}>NEXA Recover.</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '30px', fontWeight: 400 }}>
                No solo nos enfocamos en conseguirte nuevos clientes; <strong style={{ color: 'white' }}>transformamos tu base inactiva en una máquina de facturación continua.</strong> Con nuestro nuevo software propietario, reactivamos automáticamente a los clientes que te compraron y nunca volvieron.
              </p>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Reactivación de bases de datos dormidas.', 'Campañas hiper-segmentadas de fidelización.', 'Aumento directo del Ticket Promedio y LTV.', 'Métricas de retención en tiempo real.'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 600 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(210, 242, 58, 0.1)', color: '#D2F23A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/contacto" className="btn" style={{ background: '#D2F23A', color: '#12141D', fontWeight: 800 }}>Implementar NEXA Recover</Link>
            </div>

            <div style={{ order: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-20px', background: 'linear-gradient(135deg, rgba(210, 242, 58, 0.2), rgba(184, 155, 255, 0.1))', filter: 'blur(40px)', zIndex: 0, borderRadius: '50%' }} />
              <img src="/nexa-recover.png" alt="NEXA Recover SaaS Dashboard" style={{ width: '100%', borderRadius: '24px', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }} />
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
              <img src="/assets/about_mockup.png" alt="NEXA Studio" style={{ width: '100%', borderRadius: '32px' }} />
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
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
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

      {/* Área Clientes Promo */}
      <section style={{ background: '#0D0E15', padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          <span className="section-tag" style={{ background: 'rgba(184, 155, 255, 0.1)', color: '#B89BFF', borderColor: 'rgba(184, 155, 255, 0.3)' }}>Área Clientes</span>
          <h2 className="section-title text-white" style={{ marginTop: '20px' }}>Tu espacio exclusivo dentro de <span className="text-gradient">NEXA.</span></h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.8, margin: '20px 0 40px' }}>
            Accedé a tu panel personalizado para ver el seguimiento de tu servicio, entregas, archivos, estado de cuenta y próximos pasos. Todo en un solo lugar, claro y profesional.
          </p>
          <Link href="/clientes" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Ingresar al Área Clientes <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
