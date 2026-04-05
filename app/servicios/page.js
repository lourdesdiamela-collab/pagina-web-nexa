'use client';
import { motion } from 'framer-motion';
import { Target, BarChart3, Users, Layers, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

const InstaIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function Services() {
  const services = [
    { icon: BarChart3, title: 'Marketing & Estrategia', desc: 'Planes accionables para posicionar tu marca, conectar con tu audiencia y dominar tu nicho.' },
    { icon: InstaIcon, title: 'Redes Sociales y Contenido', desc: 'Gestión profesional y diseño premium de tu presencia digital.' },
    { icon: Target, title: 'Campañas y Captación', desc: 'Gestión avanzada de publicidad en Meta y Google Ads.' },
    { icon: Users, title: 'CRM y Seguimiento', desc: 'Sistemas inteligentes para organizar el seguimiento comercial.' },
    { icon: Layers, title: 'Orden Digital y Estructura', desc: 'Auditoría, diseño y organización profunda de la marca.' },
    { icon: RefreshCw, title: 'NEXA Recover', desc: 'Estrategias de customer experience y reactivación de clientes.' },
  ];

  return (
    <>
      <Navbar />
      <div className="page-wrapper" style={{ paddingTop: 'clamp(100px, 12vw, 140px)' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-tag">Áreas de expertise</span>
          <h1 className="section-title">Qué hacemos por tu <span className="text-gradient">negocio.</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>Soluciones de marketing pensadas para posicionar marcas, simplificar el seguimiento y facturar más.</p>
        </div>
        
        <section className="services" style={{ padding: '60px 0' }}>
          <div className="container">
            <div className="services-grid">
              {services.map((s, i) => (
                <motion.div key={i} className="service-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="service-icon"><s.icon size={28} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="methodology" style={{ background: '#0D0E15' }}>
          <div className="container">
            <div className="section-header" style={{ textAlign: 'center' }}>
              <span className="section-tag">Nuestro proceso</span>
              <h2 className="section-title text-white">El método NEXA</h2>
              <p className="section-subtitle text-white-50" style={{ margin: '0 auto' }}>Un framework claro diseñado para construir marcas sostenibles y escalables.</p>
            </div>
            <div className="method-grid">
              {[
                { num: '01', title: 'Diagnóstico Estratégico', desc: 'Analizamos el estado actual de la marca.' },
                { num: '02', title: 'Diseño del Plan', desc: 'Trazamos la hoja de ruta y estrategias de contenido.' },
                { num: '03', title: 'Ejecución y Despliegue', desc: 'Implementamos la presencia en redes y embudos.' },
                { num: '04', title: 'Medición y Optimización', desc: 'Monitoreamos resultados día a día.' },
              ].map((step, i) => (
                <motion.div key={i} className="method-step" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="method-number">{step.num}</div>
                  <h4>{step.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.7)' }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
