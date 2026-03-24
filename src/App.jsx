import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Target, CheckCircle2, Menu, X, TrendingUp, Search, Plus,
  Zap, Users, BarChart3, RefreshCw, Layers, Sparkles, Instagram, Linkedin,
  Phone, Building2, MessageSquare
} from 'lucide-react';
import './App.css';

// Import new premium assets
import imgHero from './assets/hero_premium.png';
import imgAbout from './assets/about_mockup.png';
import imgDeco from './assets/dark_deco.png';

/* ———————————————————————————————————
   NEXA Logo
——————————————————————————————————— */
const NexaLogo = ({ size = 32, color = '#12141D' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect x="20" y="20" width="60" height="60" rx="8" stroke={color} strokeWidth="5" />
      <circle cx="20" cy="20" r="7" fill={color} />
      <circle cx="80" cy="20" r="7" fill={color} />
      <circle cx="20" cy="80" r="7" fill={color} />
      <circle cx="80" cy="80" r="7" fill={color} />
      <path d="M35 70V30L65 70V30" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.05em', color }}>NEXA</span>
  </div>
);

/* ———————————————————————————————————
   WhatsApp Floating Button
——————————————————————————————————— */
const WhatsAppFloat = () => (
  <a
    href="https://wa.me/5491100000000"
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-float"
    aria-label="Chateanos por WhatsApp"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
    <span className="whatsapp-tooltip">Chateanos por WhatsApp</span>
  </a>
);

/* ———————————————————————————————————
   Navigation
——————————————————————————————————— */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { name: 'Servicios', href: '#servicios' },
    { name: 'Metodología', href: '#metodologia' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#" className="nav-logo"><NexaLogo /></a>
        <div className="nav-links">
          {links.map(l => <a key={l.name} href={l.href} className="nav-link">{l.name}</a>)}
          <a href="#contacto" className="nav-cta">Quiero mi auditoría</a>
        </div>
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              position: 'absolute', top: '100%', left: 24, right: 24,
              background: '#fff', borderRadius: 24, padding: 32,
              border: '1px solid rgba(184, 155, 255, 0.25)',
              boxShadow: '0 24px 80px rgba(13, 14, 21, 0.15)',
              display: 'flex', flexDirection: 'column', gap: 20
            }}
          >
            {links.map(l => (
              <a key={l.name} href={l.href} onClick={() => setIsOpen(false)}
                style={{ fontSize: '1.2rem', fontWeight: 800, color: '#12141D' }}>
                {l.name}
              </a>
            ))}
            <a href="#contacto" className="btn btn-primary" onClick={() => setIsOpen(false)}
              style={{ justifyContent: 'center' }}>
              Quiero mi auditoría
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

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
            <span className="text-gradient">Estrategia · Automatización · Crecimiento</span>
          </div>
          <h1 className="hero-title">
            Hacemos que tu marca se vea mejor, venda mejor y crezca con más <span className="text-gradient">orden.</span>
          </h1>
          <p className="hero-desc">
            En NEXA diseñamos estrategias, sistemas y experiencias digitales para marcas y negocios que quieren profesionalizarse, ordenar su operación y crecer de verdad.
          </p>
          <div className="hero-actions">
            <a href="#contacto" className="btn btn-primary">
              Quiero mi auditoría <ArrowRight size={18} />
            </a>
            <a href="#servicios" className="btn btn-outline">Ver servicios</a>
            <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-hero">
              💬 WhatsApp
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            className="premium-image-wrapper"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={imgHero} alt="NEXA Premium Growth" />
          </motion.div>
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
   Results
——————————————————————————————————— */
function Results() {
  const results = [
    {
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
      stat: '+340%',
      label: 'aumento en ventas',
      desc: 'E-commerce de motos en 3 meses con estrategia Meta + CRM',
      client: 'Ciudad Moto'
    },
    {
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      stat: '3x ROI',
      label: 'retorno sobre inversión',
      desc: 'Campaña de Google Ads + automatización de seguimiento',
      client: 'Roca Viviendas'
    },
    {
      img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
      stat: '+180%',
      label: 'leads calificados',
      desc: 'Rediseño digital + pipeline CRM personalizado',
      client: 'Estética Funcional'
    }
  ]
  return (
    <section className="results-section" id="resultados">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Casos reales</span>
          <h2 className="section-title">Resultados que <span className="gradient-text">hablan solos</span></h2>
          <p className="section-sub">No prometemos, demostramos. Estos son algunos de los resultados que logramos con nuestros clientes.</p>
        </div>
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
          <h2 className="about-title">No somos una agencia más. Somos tu equipo de crecimiento.</h2>
          <p className="about-text">
            NEXA combina marketing estratégico, automatización de procesos, gestión de redes y CRM para que tu negocio funcione con más orden, más profesionalismo y mejores resultados. No te vendemos likes, te ayudamos a <strong>facturar más y trabajar mejor</strong>.
          </p>
          <div className="about-pills">
            {['Marketing', 'Redes sociales', 'Automatización', 'CRM', 'Orden comercial', 'Crecimiento'].map((p, i) => (
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
             <img src={imgAbout} alt="NEXA Automation Workflow" />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ———————————————————————————————————
   Services
——————————————————————————————————— */
const Services = () => {
  const services = [
    {
      icon: BarChart3,
      title: 'Marketing & Estratégia',
      desc: 'Estrategia de contenido, gestión de redes y posicionamiento de marca con una visión comercial clara.',
      bgImg: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=70',
    },
    {
      icon: Zap,
      title: 'Automatización de Procesos',
      desc: 'Flujos automáticos que eliminan tareas repetitivas y mantienen tu negocio funcionando 24/7.',
      bgImg: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70',
    },
    {
      icon: Users,
      title: 'CRM y Seguimiento de Leads',
      desc: 'Organizá tu base de contactos, hacé seguimiento inteligente y convertí más oportunidades.',
      bgImg: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=70',
    },
    { icon: Target, title: 'Campañas y Captación', desc: 'Publicidad en Meta y Google Ads diseñada para traer leads calificados con ROI real.' },
    { icon: Layers, title: 'Orden y Estructura Digital', desc: 'Profesionalizamos tu operación: procesos, herramientas y estructura para escalar sin caos.' },
    { icon: RefreshCw, title: 'NEXA Recover', desc: 'Sistema de recuperación de clientes inactivos y oportunidades perdidas. Reactivá lo que ya tenés.' },
  ];

  return (
    <section id="servicios" className="services">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Lo que hacemos</span>
          <h2 className="section-title">Soluciones diseñadas para crecer</h2>
          <p className="section-subtitle">Cada servicio está pensado para que tu negocio funcione mejor, se vea mejor y facture más.</p>
        </div>
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
   Transformation
——————————————————————————————————— */
const Transformation = () => {
  const items = [
    { title: 'Dejás de improvisar', desc: 'Cada acción tiene un porqué estratégico alineado a ventas.' },
    { title: 'Ordenás tus procesos', desc: 'Todo conectado: leads, seguimiento y facturación.' },
    { title: 'Mejorás tu imagen', desc: 'Tu marca transmite lo que realmente valés a tus clientes.' },
    { title: 'Seguís tus oportunidades', desc: 'Ningún cliente potencial se pierde en el camino.' },
    { title: 'Reducís tareas manuales', desc: 'Lo que se puede automatizar, se automatiza para siempre.' },
    { title: 'Convertís mejor', desc: 'Multiplicás tus ventas optimizando tus embudos vitales.' },
  ];

  return (
    <section className="transformation">
      <img src={imgDeco} alt="Deco" className="dark-deco-image" />
      <div className="container">
        <div className="section-header">
          <span className="section-tag">El cambio real</span>
          <h2 className="section-title">Qué cambia cuando trabajás con NEXA</h2>
          <p className="section-subtitle">No es magia, es método corporativo aplicado a tu escala.</p>
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
      </div>
    </section>
  );
};

/* ———————————————————————————————————
   Methodology
——————————————————————————————————— */
const Methodology = () => {
  const steps = [
    { num: '01', title: 'Diagnóstico', desc: 'Auditoría profunda: qué funciona, qué falla, y oportunidades.' },
    { num: '02', title: 'Diseño estratégico', desc: 'Blueprint de acción con sistemas, herramientas y objetivos.' },
    { num: '03', title: 'Implementación', desc: 'Set up de CRM, automatizaciones y campañas alineadas.' },
    { num: '04', title: 'Optimización', desc: 'Monitoreo, ajustes y escalabilidad del sistema en vivo.' },
  ];

  return (
    <section id="metodologia" className="methodology">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Nuestro proceso</span>
          <h2 className="section-title">El método NEXA</h2>
          <p className="section-subtitle">Acompañamiento end-to-end de alta precisión técnica.</p>
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
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ———————————————————————————————————
   FAQ
——————————————————————————————————— */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'active' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <div className="faq-icon"><Plus size={24} /></div>
      </button>
      <div className="faq-answer">
        <div className="faq-answer-inner">{a}</div>
      </div>
    </div>
  );
};

const FAQ = () => (
  <section id="faq" className="faq">
    <div className="container">
      <div className="section-header">
        <span className="section-tag">Preguntas frecuentes</span>
        <h2 className="section-title">Resolvemos tus dudas</h2>
      </div>
      <div className="faq-list">
        <FAQItem
          q="¿Cómo sé si NEXA es para mi negocio?"
          a="Trabajamos con negocios que ya facturan pero necesitan orden, profesionalismo y estrategia. Si tu marca puede más pero estás trabado operativamente, somos tu partner."
        />
        <FAQItem
          q="¿Cuánto tiempo lleva ver resultados tangibles?"
          a="Automatización y orden operativo impactan casi instantáneamente (1-2 semanas). En captación de leads y ventas recurrentes proyectamos KPIs a los 30-45 días."
        />
        <FAQItem
          q="¿Tengo que contratar la gestión completa?"
          a="No. Nuestra metodología es modular. Comenzamos con una auditoría y proponemos el stack prioritario. Podés empezar con CRM o Automatización exclusivamente."
        />
      </div>
    </div>
  </section>
);

/* ———————————————————————————————————
   Contact
——————————————————————————————————— */
const Contact = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="contact">
      <div className="container">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="contact-grid">
            <div>
              <h2 className="contact-title">
                Ordenemos tu <br/><span className="text-gradient" style={{ background: 'linear-gradient(135deg, #D2F23A, #EAA1FB)', WebkitBackgroundClip: 'text' }}>crecimiento.</span>
              </h2>
              <p className="contact-desc">
                Completá el form y agendamos una videollamada de 20 minutos para hacer una auditoría express de tu ecosistema actual.
              </p>
              <div className="contact-perks">
                {['Sin costo', 'Sin compromiso', 'Respuesta en menos de 24hs'].map((p) => (
                  <div key={p} className="contact-perk">
                    <CheckCircle2 size={16} color="#D2F23A" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {submitted ? (
              <motion.div
                className="form-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="success-icon">✅</div>
                <h3>¡Listo! Te contactamos en menos de 24hs</h3>
                <p>Revisá tu casilla de email. Te enviaremos los próximos pasos para tu auditoría.</p>
                <button className="btn-reset" onClick={() => setSubmitted(false)}>
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <form className="contact-form-pro" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cf-name">Nombre completo <span className="required">*</span></label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cf-email">Email profesional <span className="required">*</span></label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field form-icon-group">
                    <label htmlFor="cf-phone">Teléfono</label>
                    <span className="form-field-icon">📱</span>
                    <input
                      id="cf-phone"
                      name="phone"
                      type="tel"
                      placeholder="Tu teléfono / WhatsApp"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-field form-icon-group">
                    <label htmlFor="cf-company">Empresa / Negocio</label>
                    <span className="form-field-icon">🏢</span>
                    <input
                      id="cf-company"
                      name="company"
                      type="text"
                      placeholder="Nombre de tu empresa o negocio"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-service">¿Qué servicio te interesa? <span className="required">*</span></label>
                  <select
                    id="cf-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    required
                    className={form.service === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled>¿Qué servicio te interesa?</option>
                    <option>Marketing Digital</option>
                    <option>Automatización</option>
                    <option>CRM Personalizado</option>
                    <option>Campañas Meta / Google Ads</option>
                    <option>Orden Digital</option>
                    <option>NEXA Recover</option>
                    <option>Todavía no sé / Quiero una auditoría</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-message">Contanos tu desafío</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={4}
                    placeholder="Contanos tu desafío o qué querés lograr..."
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn-submit">
                  Quiero mi auditoría gratuita →
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ———————————————————————————————————
   Footer
——————————————————————————————————— */
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-inner">
        <div className="footer-logo">
          <NexaLogo size={32} />
        </div>
        <div className="footer-links">
          <a href="#servicios">Servicios</a>
          <a href="#metodologia">Metodología</a>
          <a href="#faq">FAQ</a>
          <a href="#contacto" style={{ color: '#B89BFF' }}>Auditoría</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NEXA STRATEGY. LAB DIGITAL ESTRATÉGICO.</span>
        <div className="social-links">
          <a href="#"><Instagram size={18} /></a>
          <a href="#"><Linkedin size={18} /></a>
        </div>
      </div>
    </div>
  </footer>
);

/* ———————————————————————————————————
   App Main
——————————————————————————————————— */
const App = () => (
  <>
    <div className="bg-noise" />
    <WhatsAppFloat />
    <Navbar />
    <Hero />
    <Clients />
    <Results />
    <About />
    <Services />
    <Transformation />
    <Methodology />
    <FAQ />
    <Contact />
    <Footer />
  </>
);

export default App;
