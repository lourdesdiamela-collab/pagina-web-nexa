import React from 'react';
import { motion } from 'framer-motion';
import imgDeco from '../assets/dark_deco.png';
import { Link } from 'react-router-dom';

/* ———————————————————————————————————
   Results Detailed
——————————————————————————————————— */
function ResultsDetailed() {
  const results = [
    {
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      stat: '+340%',
      label: 'aumento en ventas',
      desc: 'E-commerce de motos en 3 meses optimizando embudos y pauta en Meta Ads.',
      client: 'Ciudad Moto'
    },
    {
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      stat: '3x ROI',
      label: 'retorno sobre inversión',
      desc: 'Captación de propiedades desde red de búsqueda Google y campañas de Meta.',
      client: 'Roca Viviendas'
    },
    {
      img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
      stat: '+180%',
      label: 'leads calificados',
      desc: 'Rediseño de posicionamiento y distribución de contenido de marca.',
      client: 'Estética Funcional'
    }
  ]
  return (
    <section className="results-section">
      <div className="container">
        <div className="results-grid">
          {results.map((r, i) => (
            <div className="result-card" key={i}>
              <div className="result-img-wrap">
                <img src={r.img} alt={r.client} loading="lazy" />
                <div className="result-overlay">
                  <div className="result-stat">{r.stat}</div>
                  <div className="result-stat-label">{r.label}</div>
                </div>
              </div>
              <div className="result-body">
                <p className="result-desc">{r.desc}</p>
                <span className="result-client">— {r.client}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ———————————————————————————————————
   Transformation
——————————————————————————————————— */
const Transformation = () => {
  const items = [
    { title: 'Dejás de improvisar', desc: 'Cada acción y contenido tiene un porqué estratégico alineado a crecimiento real.' },
    { title: 'Ordenás tus procesos', desc: 'Todo tu mundo digital conectado: redes, leads y embudos de ventas.' },
    { title: 'Mejorás tu imagen', desc: 'Tu marca por fin transmite la autoridad y el profesionalismo que realmente tiene.' },
    { title: 'Seguís tus oportunidades', desc: 'Ningún cliente potencial se pierde en el fondo de un chat o correo sin respuesta.' },
    { title: 'Reducís tareas manuales', desc: 'Lo que se puede estructurar o automatizar, se delega para que operes tranquilo.' },
    { title: 'Convertís mejor', desc: 'Dejás de sumar seguidores vacíos para empezar a sumar prospectos rentables.' },
  ];

  return (
    <section className="transformation">
      <img src={imgDeco} alt="Deco" className="dark-deco-image" />
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Impacto</span>
          <h2 className="section-title">Qué cambia cuando trabajás con el equipo de NEXA</h2>
          <p className="section-subtitle">Una marca más clara, un modelo más ordenado y un marketing que tracciona clientes de verdad.</p>
        </div>
        <div className="transform-grid">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="transform-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="lima-dot" />
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <Link to="/contacto" className="btn btn-primary">
            Quiero potenciar mi negocio
          </Link>
        </div>
      </div>
    </section>
  );
};

const Cases = () => (
  <div className="page-wrapper" style={{ paddingTop: '120px' }}>
    <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
      <span className="section-tag">Impacto Demostrable</span>
      <h1 className="section-title">Casos de <span className="text-gradient">Éxito.</span></h1>
      <p className="section-subtitle" style={{ margin: '0 auto' }}>Nuestro mayor caso de éxito es dejar de hablar de nosotros para mostrar el crecimiento de los negocios de nuestros clientes.</p>
    </div>
    <ResultsDetailed />
    <Transformation />
  </div>
);

export default Cases;
