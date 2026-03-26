'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Cases() {
  const results = [
    { img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80', stat: '+340%', label: 'aumento en ventas', desc: 'E-commerce de motos en 3 meses.', client: 'Ciudad Moto' },
    { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80', stat: '3x ROI', label: 'retorno sobre inversión', desc: 'Captación de propiedades desde red de búsqueda.', client: 'Roca Viviendas' },
    { img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80', stat: '+180%', label: 'leads calificados', desc: 'Rediseño de posicionamiento y contenido.', client: 'Estética Funcional' }
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ paddingTop: '120px' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-tag">Impacto Demostrable</span>
          <h1 className="section-title">Casos de <span className="text-gradient">Éxito.</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Nuestro mayor caso de éxito es dejar de hablar de nosotros para mostrar el crecimiento de los negocios de nuestros clientes.</p>
        </div>

        <section className="results-section" style={{ padding: '80px 0', background: 'rgba(184, 155, 255, 0.02)' }}>
          <div className="container">
            <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
              {results.map((r, i) => (
                <motion.div 
                  className="result-card" 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ background: '#12141D', borderRadius: '32px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                >
                  <div className="result-img-wrap" style={{ height: '240px', overflow: 'hidden', position: 'relative' }}>
                    <img src={r.img} alt={r.client} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="hover-zoom" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #12141D, transparent)' }} />
                    <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(210, 242, 58, 0.9)', color: '#0D0E15', padding: '6px 16px', borderRadius: '100px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      {r.client}
                    </div>
                  </div>
                  <div className="result-body" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '15px' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#B89BFF', letterSpacing: '-2px' }}>{r.stat}</span>
                      <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>{r.label}</span>
                    </div>
                    <p className="result-desc" style={{ color: 'white', fontSize: '1.1rem', lineHeight: 1.5, fontWeight: 500 }}>{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="transformation">
          <img src="/assets/dark_deco.png" alt="Deco" className="dark-deco-image" />
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Impacto</span>
              <h2 className="section-title">Qué cambia cuando trabajás con NEXA</h2>
            </div>
            <div className="transform-grid">
              {[
                { title: 'Dejás de improvisar', desc: 'Estrategia alineada a crecimiento real.' },
                { title: 'Ordenás tus procesos', desc: 'Todo tu mundo digital conectado.' },
                { title: 'Mejorás tu imagen', desc: 'Autoridad y profesionalismo.' },
                { title: 'Convertís mejor', desc: 'Prospectos rentables en vez de vacíos.' },
              ].map((item, i) => (
                <motion.div key={i} className="transform-card" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <div className="lima-dot" />
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Link href="/contacto" className="btn btn-primary">Quiero potenciar mi negocio</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
