import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, PlayCircle, BarChart3, Instagram, Target, Users, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import imgAbout from '../assets/about_mockup.png';
import imgDeco from '../assets/dark_deco.png';
import acdAuto from '../assets/nexa_academy_automation.png';

/* ———————————————————————————————————
   Hero
——————————————————————————————————— */
const Hero = () => (
  <section className="hero">
    <div className="hero-deco-circle hero-deco-1" />
    <div className="hero-deco-circle hero-deco-2" />
    <div className="container">
      <div className="hero-grid">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
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
            <Link to="/contacto" className="btn btn-primary">
              Hablemos de tu marca <ArrowRight size={18} />
            </Link>
            <Link to="/servicios" className="btn btn-outline">Ver servicios</Link>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className="video-wrapper">
            <div className="tech-animated-bg hero-tech-bg"></div>
            <div className="video-overlay"><PlayCircle size={48} color="rgba(255,255,255,0.7)"/></div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ———————————————————————————————————
   Clients
——————————————————————————————————— */
const Clients = () => (
  <section className="clients">
    <div className="container">
      <p className="clients-label">Marcas que confiaron en NEXA</p>
      <div className="clients-row">
        {['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estética Funcional', 'Aqualaf'].map((name, i) => (
          <motion.span
            key={name}
            className="client-logo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.4, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {name}
          </motion.span>
        ))}
      </div>
    </div>
  </section>
);

/* ———————————————————————————————————
   About
——————————————————————————————————— */
const About = () => (
  <section className="about">
    <div className="container">
      <div className="about-grid">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="about-tag">¿Quiénes somos?</span>
          <h2 className="about-title">Tu estudio estratégico de marketing y crecimiento.</h2>
          <p className="about-text">
            En NEXA combinamos estrategia, contenido, campañas y seguimiento para ayudar a marcas y negocios a crecer con más claridad, mejor imagen y mejores resultados.<br/><br/>
            No hacemos marketing por hacer: construimos marcas con dirección.
          </p>
          <div className="about-pills">
            {['Estrategia', 'Campañas', 'Contenido', 'Redes Sociales', 'Ventas', 'Crecimiento'].map((p, i) => (
              <motion.span
                key={p}
                className="pill"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (i * 0.1) }}
              >
                {p}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="premium-image-wrapper">
             <img src={imgAbout} alt="NEXA Studio Marketing Strategy" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ———————————————————————————————————
   Services Summary
——————————————————————————————————— */
const ServicesSummary = () => {
  const services = [
    { icon: BarChart3, title: 'Marketing & Estrategia', desc: 'Planes accionables para posicionar tu marca.' },
    { icon: Instagram, title: 'Redes Sociales', desc: 'Contenido y gestión para construir comunidad y autoridad.' },
    { icon: Target, title: 'Campañas y Captación', desc: 'Publicidad en Meta/Google para atraer clientes calificados.' },
  ];

  return (
    <section id="servicios" className="services" style={{ paddingBottom: '60px' }}>
      <div className="container">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="section-tag">Nuestras áreas</span>
            <h2 className="section-title">Soluciones para crecer</h2>
            <p className="section-subtitle">Acompañamiento integral para escalar tu facturación y alcance.</p>
          </div>
          <Link to="/servicios" className="btn btn-outline" style={{ marginBottom: '20px' }}>
            Ver todos los servicios <ArrowRight size={16}/>
          </Link>
        </div>
        <div className="services-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
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
   Results Summary
——————————————————————————————————— */
function ResultsSummary() {
  const result = {
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    stat: '+340%',
    label: 'aumento en ventas',
    desc: 'E-commerce de motos en 3 meses con estrategia Meta Ads',
    client: 'Ciudad Moto'
  };

  return (
    <section className="results-section bg-dark" style={{ borderTop: 'none', padding: '80px 0' }}>
      <div className="container">
        <div className="recover-grid" style={{ alignItems: 'center' }}>
          <div>
             <span className="section-badge" style={{ background: 'rgba(255,255,255,0.1)' }}>Casos Reales</span>
             <h2 className="section-title text-white">Resultados que marcan la <span className="gradient-text">diferencia.</span></h2>
             <p className="section-sub text-white-50" style={{ marginBottom: '30px' }}>
               No prometemos métricas vacías, demostramos crecimiento medible y sostenido para las marcas con las que nos asociamos.
             </p>
             <Link to="/casos" className="btn btn-primary">
               Explorar casos reales
             </Link>
          </div>
          <div className="result-card" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="result-img-wrap">
              <img src={result.img} alt={result.client} loading="lazy" />
              <div className="result-overlay">
                <div className="result-stat">{result.stat}</div>
                <div className="result-stat-label">{result.label}</div>
              </div>
            </div>
            <div className="result-body">
              <p className="result-desc">{result.desc}</p>
              <span className="result-client">— {result.client}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ———————————————————————————————————
   Academy Summary
——————————————————————————————————— */
const AcademySummary = () => (
  <section className="academy-section" style={{ background: '#F4EEF8', padding: '100px 0' }}>
    <div className="container" style={{ textAlign: 'center' }}>
       <span className="section-tag">Aprende con NEXA</span>
       <h2 className="section-title">Tu hub de contenido de <span className="text-gradient">Marketing.</span></h2>
       <p className="section-subtitle" style={{ margin: '0 auto 40px auto', maxWidth: '600px' }}>
         Artículos, guías y tutoriales gratuitos para entender el posicionamiento y multiplicar tu captación.
       </p>
       <img src={acdAuto} alt="Academy Deck" style={{ width: '100%', maxWidth: '500px', borderRadius: '24px', marginBottom: '40px', boxShadow: '0 24px 60px rgba(184, 155, 255, 0.2)' }} />
       <br/ >
       <Link to="/aprende" className="btn btn-primary">
         Entrar a la Academia <ArrowRight size={16}/>
       </Link>
    </div>
  </section>
);


const Home = () => {
  return (
    <>
      <Hero />
      <Clients />
      <About />
      <ServicesSummary />
      <ResultsSummary />
      <AcademySummary />
    </>
  );
};

export default Home;
