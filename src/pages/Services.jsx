import React from 'react';
import { motion } from 'framer-motion';
import { Target, BarChart3, Instagram, Users, Layers, RefreshCw } from 'lucide-react';

/* ———————————————————————————————————
   Services Grid Detailed
——————————————————————————————————— */
const ServicesDetailed = () => {
  const services = [
    {
      icon: BarChart3,
      title: 'Marketing & Estrategia',
      desc: 'Planes accionables para posicionar tu marca, conectar con tu audiencia y dominar tu nicho. No hacemos marketing genérico; construimos un camino claro para que tu negocio crezca con propósito.',
      bgImg: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=70',
    },
    {
      icon: Instagram,
      title: 'Redes Sociales y Contenido',
      desc: 'Gestión profesional y diseño premium de tu presencia digital. Creamos contenido estratégico que no solo se ve increíble, sino que construye comunidad y autoridad en tu mercado.',
      bgImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70',
    },
    {
      icon: Target,
      title: 'Campañas y Captación',
      desc: 'Gestión avanzada de publicidad en Meta y Google Ads. Diseñamos embudos rentables para maximizar la visibilidad de tu marca y atraer prospectos altamente calificados.',
      bgImg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=70',
    },
    { 
      icon: Users, 
      title: 'CRM y Seguimiento', 
      desc: 'Sistemas inteligentes para organizar el seguimiento comercial. Implementamos herramientas que aseguran que ninguna oportunidad se pierda y que cada lead reciba atención.' 
    },
    { 
      icon: Layers, 
      title: 'Orden Digital y Estructura', 
      desc: 'Auditoría, diseño y organización profunda de la marca. Ordenamos todos tus puntos de contacto online para que tu negocio proyecte absoluta confianza y solides a primera vista.' 
    },
    { 
      icon: RefreshCw, 
      title: 'NEXA Recover', 
      desc: 'Estrategias de customer experience y reactivación. Volvemos a contactar y fidelizar clientes inactivos de tu base de datos mediante campañas inteligentes de retención.' 
    },
  ];

  return (
    <section className="services" style={{ padding: '60px 0' }}>
      <div className="container">
        <div className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="service-card"
              style={s.bgImg ? { '--card-bg-img': `url(${s.bgImg})` } : {}}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {s.bgImg && <div className="service-card-bg" />}
              <div className="service-icon"><s.icon size={28} /></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ———————————————————————————————————
   Methodology
——————————————————————————————————— */
const Methodology = () => {
  const steps = [
    { num: '01', title: 'Diagnóstico Estratégico', desc: 'Analizamos profundamente el estado actual de la marca: qué funciona, qué falla, y detectamos oportunidades inmediatas de crecimiento.' },
    { num: '02', title: 'Diseño del Plan', desc: 'Trazamos la hoja de ruta con plataformas, estrategias de contenido y objetivos de venta adaptados a la realidad de tu negocio.' },
    { num: '03', title: 'Ejecución y Despliegue', desc: 'Implementamos la presencia en redes, el embudo de captación, los sistemas de CRM y la distribución del contenido.' },
    { num: '04', title: 'Medición y Optimización', desc: 'Monitoreamos resultados día a día, realizando ajustes iterativos para escalar el impacto y lograr mayor retorno de inversión.' },
  ];

  return (
    <section className="methodology" style={{ background: '#0D0E15' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <span className="section-tag">Nuestro proceso</span>
          <h2 className="section-title text-white">El método NEXA</h2>
          <p className="section-subtitle text-white-50" style={{ margin: '0 auto' }}>Un framework claro, sin tecnicismos innecesarios, diseñado para construir marcas sostenibles y escalables.</p>
        </div>
        <div className="method-grid">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="method-step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="method-number">{step.num}</div>
              <h4>{step.title}</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => (
  <div className="page-wrapper" style={{ paddingTop: '120px' }}>
    <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
      <span className="section-tag">Áreas de expertise</span>
      <h1 className="section-title">Qué hacemos por tu <span className="text-gradient">negocio.</span></h1>
      <p className="section-subtitle" style={{ margin: '0 auto' }}>Soluciones de marketing pensadas para posicionar marcas, simplificar el seguimiento y facturar más.</p>
    </div>
    <ServicesDetailed />
    <Methodology />
  </div>
);

export default Services;
