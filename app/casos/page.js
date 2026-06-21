'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const RESULTS = [
  { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', stat: '+340%', label: 'aumento en ventas', desc: 'E-commerce de motos en 3 meses.', client: 'Ciudad Moto' },
  { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', stat: '3x ROI', label: 'retorno sobre inversión', desc: 'Captación de propiedades desde red de búsqueda.', client: 'Roca Viviendas' },
  { img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80', stat: '+180%', label: 'leads calificados', desc: 'Rediseño de posicionamiento y contenido.', client: 'Estética Funcional' },
];

const IMPACTS = [
  { title: 'Dejás de improvisar', desc: 'Estrategia alineada a crecimiento real.' },
  { title: 'Ordenás tus procesos', desc: 'Todo tu mundo digital conectado.' },
  { title: 'Mejorás tu imagen', desc: 'Autoridad y profesionalismo en cada punto de contacto.' },
  { title: 'Convertís mejor', desc: 'Prospectos rentables en vez de tráfico vacío.' },
];

export default function Cases() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <main style={{ paddingTop: 'clamp(100px, 12vw, 140px)' }}>
        {/* Header */}
        <div className="container" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-tag">Impacto Demostrable</span>
          <h1 className="section-title">Casos de <span className="text-gradient">Éxito.</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Nuestro mayor caso de éxito es mostrar el crecimiento real de los negocios de nuestros clientes.</p>
        </div>

        <section style={{ padding: '0 0 56px' }}><div className="container"><motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', maxWidth: 980, margin: '0 auto', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 70px rgba(13,14,21,0.14)' }}><img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1400&q=80" alt="Resultados de campañas y estrategias de marketing basadas en datos" loading="lazy" style={{ width: '100%', height: 'clamp(220px, 32vw, 360px)', objectFit: 'cover', display: 'block' }} /><div style={{ position: 'absolute', left: 24, bottom: 24, background: '#fff', padding: '13px 22px', borderRadius: 100, fontSize: '0.86rem', fontWeight: 700, color: '#12141D', boxShadow: '0 14px 32px rgba(13,14,21,0.18)' }}>Resultados medibles, con datos reales</div></motion.div></div></section>{/* Results Cards */}
        <section style={{ padding: '40px 0 80px', background: 'rgba(184,155,255,0.02)' }}>
          <div className="container">
            <div className="results-grid">
              {RESULTS.map((r, i) => (
                <motion.article className="result-card" key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ background: '#12141D', borderRadius: 28, border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}>
                  <div className="result-img-wrap" style={{ height: 220 }}>
                    <img src={r.img} alt={r.client} loading="lazy" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #12141D, transparent 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(210,242,58,0.9)', color: '#0D0E15', padding: '5px 14px', borderRadius: 100, fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                      {r.client}
                    </div>
                  </div>
                  <div style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#B89BFF', letterSpacing: '-1.5px' }}>{r.stat}</span>
                      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase' }}>{r.label}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: 1.5 }}>{r.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="transformation">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Impacto</span>
              <h2 className="section-title">Qué cambia cuando trabajás con NEXA</h2>
            </div>
            <div className="transform-grid">
              {IMPACTS.map((item, i) => (
                <motion.div key={i} className="transform-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="lima-dot" />
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link href="/contacto" className="btn btn-lima">Quiero potenciar mi negocio <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
