'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import {
  ArrowRight, CheckCircle2, Sparkles, TrendingUp,
  Database, Cpu, Plus, Megaphone, ChevronRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { MarketingBadges } from '@/components/ui/marketing-badges';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Data ─── */
const SERVICES = [
  {
    icon: Cpu,
    title: 'Seguimiento de Clientes con IA',
    desc: 'Ordenamos tus contactos y leads en un sistema simple, con asistentes de Inteligencia Artificial que responden y hacen seguimiento para que ninguna venta se enfríe.',
    tag: 'CRM',
    tagColor: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.25)',
    slug: 'crm_seguimiento',
  },
  {
    icon: TrendingUp,
    title: 'Publicidad que Convierte',
    desc: 'Creamos y optimizamos campañas de Instagram, Facebook y Google Ads enfocadas en un solo objetivo: traerte clientes reales, no solo clics.',
    tag: 'Performance',
    tagColor: '#D2F23A',
    accent: 'rgba(210,242,58,0.08)',
    border: 'rgba(210,242,58,0.2)',
    slug: 'meta_ads',
  },
  {
    icon: Database,
    title: 'Automatización de Marketing',
    desc: 'Ponemos tu marketing en piloto automático: reportes, mensajes de seguimiento y tareas repetitivas resueltos solos, para que tu equipo se enfoque en vender.',
    tag: 'Eficiencia',
    tagColor: '#EAA1FB',
    accent: 'rgba(234,161,251,0.08)',
    border: 'rgba(234,161,251,0.2)',
    slug: 'nexa_recover',
  },
];

const RECOVER_ITEMS = [
  { title: 'Clientes Inactivos', desc: 'Reactivamos cuentas que compraron en el pasado pero dejaron de interactuar.', color: '#B89BFF' },
  { title: 'Leads Abandonados', desc: 'Recuperamos contactos que consultaron pero nunca concretaron por falta de seguimiento.', color: '#D2F23A' },
  { title: 'Ventas Perdidas', desc: 'Analizamos propuestas rechazadas para renegociar con ofertas automatizadas.', color: '#EAA1FB' },
  { title: 'Bases de Datos Frías', desc: 'Explotamos bases de correos y teléfonos archivadas mediante secuencias inteligentes.', color: '#FE8FD9' },
];

/*
 * NOTA (septiembre 2026): se eliminaron de esta página los bloques STATS
 * (+20 marcas asesoradas, +275% aumento en ventas, 3x ROI promedio, +6 años
 * de experiencia), TESTIMONIALS (tres testimonios con nombre, empresa y
 * métrica) y la tira de logos de clientes, porque eran datos inventados:
 * NEXA no tiene todavía clientes ni resultados que respalden esas cifras.
 * No reemplazar por números "de referencia del rubro": mientras no haya
 * datos reales y verificables, estas secciones no van.
 */

const CHANNEL_FEATURES = [
  'Estrategia multicanal integrada',
  'Contenido y campañas optimizados con Inteligencia Artificial',
  'Optimización continua basada en datos reales',
  'Reportes semanales 100% transparentes',
];

const FAQS = [
  {
    question: '¿Qué diferencia a NEXA de una agencia de marketing tradicional?',
    answer: 'Sí, somos una agencia de marketing — pero no nos quedamos en lo estético. Sumamos Inteligencia Artificial a la gestión de redes, la publicidad y el seguimiento de tus clientes, para que cada campaña se traduzca en ventas medibles y no solo en likes.',
  },
  {
    question: '¿Cómo funciona la integración con nuestro negocio?',
    answer: 'Arrancamos con un diagnóstico de tu marca, tus redes y tu forma actual de conseguir clientes. Con eso armamos el plan de marketing, las campañas y el sistema de seguimiento comercial que necesitás, y capacitamos a tu equipo para usarlo. Todo queda centralizado en un solo lugar.',
  },
  {
    question: '¿Qué es NEXA Recover y cuándo veo resultados?',
    answer: 'NEXA Recover es nuestro servicio para reactivar clientes inactivos y leads que quedaron sin cerrar en tu base de contactos, con mensajes automatizados de seguimiento. Los resultados suelen verse en los primeros 30 días.',
  },
  {
    question: '¿Necesito saber de tecnología para trabajar con NEXA?',
    answer: 'Para nada. Nosotros nos encargamos de todo: conectamos tu WhatsApp, tus redes y tu sistema de seguimiento de clientes sin que tengas que ocuparte de ningún detalle técnico.',
  },
];

/* ─── Mouse Gradient Hook ─── */
function useMouseGradient() {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 80 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 80 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 100);
      mouseY.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return { springX, springY };
}

/* ─── Page ─── */
export default function HomePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: 'Redes Sociales y Contenido',
    companyName: '',
    website: '',
    goals: 'Ordenar mi Marketing',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const { springX, springY } = useMouseGradient();

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const nextStep = () => {
    if (step === 2 && !formData.companyName.trim()) { alert('Por favor ingresá el nombre de tu negocio'); return; }
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const selectService = (service) => { updateField('service', service); setStep(2); };
  const selectGoal = (goal) => { updateField('goals', goal); setStep(4); };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData.contactName || !formData.contactEmail || !formData.contactPhone) {
      alert('Por favor completá todos los campos de contacto'); return;
    }
    setSending(true); setStatus('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          company: formData.companyName,
          service: formData.service,
          challenge: `Objetivo: ${formData.goals}. Website: ${formData.website || 'No especificado'}.`,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo enviar');
      setStatus('ok');
      setFormData({ service: 'Redes Sociales y Contenido', companyName: '', website: '', goals: 'Ordenar mi Marketing', contactName: '', contactEmail: '', contactPhone: '' });
      setStep(1);
    } catch (err) {
      console.error(err); setStatus('error');
    } finally { setSending(false); }
  };

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="landing-main">

        {/* ══════ HERO ══════ */}
        <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Mouse-reactive gradient */}
          <motion.div
            className="hero-mouse-gradient"
            style={{
              background: `radial-gradient(circle 700px at ${springX.get()}% ${springY.get()}%, rgba(124,58,237,0.18) 0%, transparent 60%),
                           radial-gradient(circle 500px at calc(${springX.get()}% + 15%) calc(${springY.get()}% - 10%), rgba(234,161,251,0.1) 0%, transparent 55%),
                           radial-gradient(circle 900px at 80% 20%, rgba(210,242,58,0.06) 0%, transparent 50%)`,
            }}
          />

          {/* Static ambient orbs */}
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />

          <div className="container hero-container">
            <motion.div
              className="hero-content"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="hero-badge">
                <Sparkles size={14} />
                <span>Marketing Digital con Inteligencia Artificial</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="hero-title">
                Transformamos tus redes, tu publicidad y tu seguimiento de clientes en{' '}
                <span className="text-highlight">crecimiento medible.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="hero-subtitle">
                Gestionamos tus redes sociales, tus campañas de publicidad y el seguimiento de tus clientes con Inteligencia Artificial aplicada al marketing, para convertir seguidores en ventas reales.
              </motion.p>

              <motion.div variants={fadeUp} className="hero-actions">
                <motion.a
                  href="#contacto"
                  className="btn-lima-cta"
                  whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(210,242,58,0.45)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Iniciar Diagnóstico
                  <ArrowRight size={18} />
                </motion.a>
                <motion.a
                  href="#servicios"
                  className="btn-outline-dark"
                  whileHover={{ borderColor: 'rgba(184,155,255,0.6)', background: 'rgba(184,155,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Ver soluciones
                </motion.a>
              </motion.div>

              {/* Se eliminaron los chips de métricas del hero ("+20 Marcas
                  activas", "3x ROI Promedio", "+275% en ventas"): eran cifras
                  inventadas. No reponer sin datos reales. */}
            </motion.div>

            {/* Se eliminó el panel de dashboard del hero: mostraba métricas
                fabricadas ("+127% rendimiento mensual", "248 leads",
                "73% conversión", "3.8x ROI", barras por canal, "Nuevo cliente
                — Empresa XYZ firmó propuesta", "ROI último mes 3.2x / +45% vs
                mes anterior") como si fueran resultados reales de NEXA.
                El hero pasa a una sola columna centrada. */}
          </div>
        </section>

        {/* Se eliminó la tira de logos "Marcas que ya crecieron con NEXA"
            (Ciudad Moto, Corven Motos, Roca Viviendas, Casa Diez, Estética
            Funcional, Aqualaf): son marcas ajenas presentadas como clientes.

            Se eliminó la barra de estadísticas (+20 marcas asesoradas,
            +275% aumento en ventas, 3x ROI promedio, +6 años de experiencia):
            además de inventadas, se veían como "+0" porque el contador solo se
            animaba al entrar en viewport. */}

        {/* ══════ SERVICES ══════ */}
        <section id="servicios" className="services-section">
          <div className="container">
            <motion.div
              className="section-header"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              <motion.span variants={fadeUp} className="section-tag">Soluciones</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Cómo te ayudamos a crecer</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle">
                Reemplazamos la improvisación por un plan de marketing que funciona, canal por canal.
              </motion.p>
            </motion.div>

            <motion.div
              className="services-grid"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <Link key={service.title} href={`/servicios?servicio=${service.slug}#planes`} style={{ textDecoration: 'none', display: 'block' }}>
                    <motion.article
                      variants={scaleIn}
                      className="service-card-premium"
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      style={{ '--card-accent': service.tagColor, '--card-glow': service.accent, cursor: 'pointer' }}
                    >
                      <div className="svc-glow" style={{ background: `radial-gradient(circle at top right, ${service.accent}, transparent 60%)` }} />
                      <div className="svc-tag" style={{ color: service.tagColor, background: service.accent, border: `1px solid ${service.border}` }}>
                        {service.tag}
                      </div>
                      <div className="service-icon-wrapper" style={{ background: service.accent, border: `1px solid ${service.border}` }}>
                        <Icon size={26} color={service.tagColor} />
                      </div>
                      <h3 style={{ color: 'white' }}>{service.title}</h3>
                      <p>{service.desc}</p>
                      <div className="svc-learn-more" style={{ color: service.tagColor }}>
                        <span>Ver detalles y precios</span>
                        <ChevronRight size={14} />
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ══════ CHANNELS ══════ */}
        <section id="canales" className="channels-section">
          <div className="container">
            <div className="channels-grid">
              <motion.div
                className="channels-text"
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
              >
                <motion.div variants={fadeUp} className="channels-tag">
                  <Megaphone size={14} />
                  <span>Marketing 360°</span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="channels-title">
                  Dominamos cada canal para{' '}
                  <span className="text-highlight">maximizar tu alcance</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="channels-desc">
                  Desde SEO hasta redes sociales, email marketing y publicidad paga.
                  Nuestra agencia cubre todos los frentes para que ninguna oportunidad de crecimiento se escape.
                </motion.p>
                <motion.ul variants={staggerFast} className="channels-list">
                  {CHANNEL_FEATURES.map((item) => (
                    <motion.li key={item} variants={fadeUp} className="channels-list-item">
                      <CheckCircle2 size={15} color="#D2F23A" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.a
                  variants={fadeUp}
                  href="#contacto"
                  className="btn-lima-cta"
                  style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(210,242,58,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Armar mi estrategia
                  <ArrowRight size={16} />
                </motion.a>
              </motion.div>

              <motion.div
                className="channels-badges-wrap"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="channels-badges-bg" />
                <MarketingBadges />
                <p className="channels-hint">Interactuá con los canales</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════ NEXA RECOVER ══════ */}
        <section className="recover-section">
          <div className="container">
            <motion.div
              className="recover-header"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              <motion.span variants={fadeUp} className="section-tag-recover">Premium Feature</motion.span>
              <motion.h2 variants={fadeUp} className="recover-title">NEXA Recover</motion.h2>
              <motion.p variants={fadeUp} className="recover-subtitle">
                &ldquo;Recuperamos oportunidades que ya existen dentro de tu negocio.&rdquo;
              </motion.p>
              <motion.p variants={fadeUp} className="recover-desc">
                Antes de gastar más en publicidad, explotamos el oro oculto en tu base de datos actual.
                Implementamos secuencias de reactivación y bots comerciales inteligentes para recuperar facturación estancada.
              </motion.p>
              <motion.a
                variants={fadeUp}
                href="#contacto"
                onClick={() => selectService('Nexa Recover')}
                className="btn-lima-cta"
                whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(210,242,58,0.4)' }}
              >
                Recuperar Base de Datos
                <ArrowRight size={18} />
              </motion.a>
            </motion.div>

            <motion.div
              className="recover-grid-visual"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {RECOVER_ITEMS.map((item) => (
                <motion.div
                  key={item.title}
                  variants={scaleIn}
                  className="recover-card-premium"
                  whileHover={{ y: -6, borderColor: `${item.color}40` }}
                  style={{ '--item-color': item.color }}
                >
                  <div className="recover-card-dot" style={{ background: item.color, boxShadow: `0 0 12px ${item.color}60` }} />
                  <h4 style={{ color: item.color }}>{item.title}</h4>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Se eliminó la sección de testimonios ("Lo que dicen nuestros
            clientes" + "Más de 20 empresas ya escalaron su negocio con NEXA"
            + tres testimonios firmados por Martina González / Boutique Aurea,
            Carlos Ruiz / TechFlow Solutions y Valentina Méndez / Estudio
            Vivo). Eran inventados: NEXA no tiene clientes todavía. */}

        {/* ══════ CONTACT ══════ */}
        <section id="contacto" className="contact-section">
          <div className="container">
            <motion.div
              className="contact-pretitle"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp} className="contact-pretitle-tag">
                <Sparkles size={14} />
                Consultoría gratuita · Sin compromiso
              </motion.div>
              <motion.h2 variants={fadeUp} className="contact-pretitle-h2">
                Diseñemos tu<br />
                <span className="text-highlight">Próximo Paso.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="contact-pretitle-sub">
                Completá el diagnóstico rápido. En menos de 24hs un estratega de NEXA te contacta
                con un análisis personalizado de tu negocio.
              </motion.p>
            </motion.div>

            <div className="contact-wrapper">
              <motion.div
                className="contact-info"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="benefit-list">
                  {[
                    'Diagnóstico de marketing y redes sin cargo',
                    'Análisis de tu competencia y tu marca',
                    'Plan de acción personalizado, sin compromiso',
                  ].map((b, i) => (
                    <motion.div
                      key={b}
                      className="benefit-item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    >
                      <CheckCircle2 size={18} className="benefit-icon" />
                      <span>{b}</span>
                    </motion.div>
                  ))}
                </div>
                {/* Se eliminó el cartel "+8 empresas esta semana / ya
                    solicitaron su diagnóstico": dato inventado. */}
              </motion.div>

              <motion.div
                className="form-card-container"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="form-steps-header">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`step-indicator ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                      {step > s ? '✓' : s}
                    </div>
                  ))}
                </div>

                <form onSubmit={submitForm} className="multistep-form">
                  <AnimatePresence mode="wait">
                    {status === 'ok' && (
                      <motion.div
                        key="ok"
                        className="status-banner success"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        ¡Diagnóstico enviado con éxito! Nos comunicaremos en las próximas 24 horas.
                      </motion.div>
                    )}
                    {status === 'error' && (
                      <motion.div
                        key="err"
                        className="status-banner error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        Ocurrió un error al enviar. Por favor, intentalo de nuevo.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        className="form-step"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h3>¿Qué solución necesitás prioritariamente?</h3>
                        <div className="options-grid">
                          {['Redes Sociales y Contenido', 'Publicidad y Ads', 'Recuperar Clientes Inactivos', 'Plan de Marketing Completo'].map((srv) => (
                            <motion.button
                              key={srv}
                              type="button"
                              className={`option-btn ${formData.service === srv ? 'selected' : ''}`}
                              onClick={() => selectService(srv)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {srv}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        className="form-step"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h3>Contanos de tu negocio</h3>
                        <div className="form-group">
                          <label>Nombre de la Empresa</label>
                          <input type="text" required value={formData.companyName} onChange={(e) => updateField('companyName', e.target.value)} placeholder="Ej: Nexa Solutions" />
                        </div>
                        <div className="form-group">
                          <label>Sitio Web (Opcional)</label>
                          <input type="text" value={formData.website} onChange={(e) => updateField('website', e.target.value)} placeholder="www.tuempresa.com" />
                        </div>
                        <div className="form-navigation">
                          <button type="button" onClick={prevStep} className="btn-back">Atrás</button>
                          <motion.button type="button" onClick={nextStep} className="btn-next" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Siguiente</motion.button>
                        </div>
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        className="form-step"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h3>¿Cuál es tu objetivo comercial principal?</h3>
                        <div className="options-grid">
                          {['Ordenar mi Marketing', 'Conseguir Más Clientes', 'Recuperar Clientes Inactivos', 'Ahorrar Tiempo con Automatización'].map((goal) => (
                            <motion.button
                              key={goal}
                              type="button"
                              className={`option-btn ${formData.goals === goal ? 'selected' : ''}`}
                              onClick={() => selectGoal(goal)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {goal}
                            </motion.button>
                          ))}
                        </div>
                        <div className="form-navigation">
                          <button type="button" onClick={prevStep} className="btn-back">Atrás</button>
                        </div>
                      </motion.div>
                    )}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        className="form-step"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <h3>Completá tus datos de contacto</h3>
                        <div className="form-group">
                          <label>Nombre y Apellido</label>
                          <input type="text" required value={formData.contactName} onChange={(e) => updateField('contactName', e.target.value)} placeholder="Ej: Carlos Pérez" />
                        </div>
                        <div className="form-group">
                          <label>Email Corporativo</label>
                          <input type="email" required value={formData.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} placeholder="carlos@empresa.com" />
                        </div>
                        <div className="form-group">
                          <label>Teléfono / WhatsApp</label>
                          <input type="tel" required value={formData.contactPhone} onChange={(e) => updateField('contactPhone', e.target.value)} placeholder="+54 9 11 1234 5678" />
                        </div>
                        <div className="form-navigation">
                          <button type="button" onClick={prevStep} className="btn-back">Atrás</button>
                          <motion.button type="submit" disabled={sending} className="btn-submit-form" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            {sending ? 'Procesando...' : 'Iniciar Diagnóstico'}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════ FAQ ══════ */}
        <section className="faq-section">
          <div className="container max-w-3xl">
            <motion.div
              className="section-header"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.span variants={fadeUp} className="section-tag">Dudas</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Preguntas Frecuentes</motion.h2>
            </motion.div>
            <motion.div
              className="faq-list"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {FAQS.map((faq, index) => (
                <motion.div key={index} variants={fadeUp} className="faq-item-premium">
                  <motion.button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="faq-trigger"
                    whileHover={{ color: '#B89BFF' }}
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: activeFaq === index ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="faq-icon"
                    >
                      <Plus size={18} />
                    </motion.div>
                  </motion.button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <style dangerouslySetInnerHTML={{ __html: `
        .landing-main {
          background-color: #0A0B10;
          color: #FFFFFF;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero-section { padding: 160px 0 100px; position: relative; overflow: hidden; }
        .hero-mouse-gradient {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          transition: background 0.1s ease;
        }
        .hero-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(90px); }
        .hero-orb-1 { width: 700px; height: 700px; top: -200px; left: -150px; background: radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%); animation: orbDrift1 12s ease-in-out infinite; }
        .hero-orb-2 { width: 450px; height: 450px; top: 40%; right: -100px; background: radial-gradient(circle, rgba(210,242,58,0.08), transparent 70%); animation: orbDrift2 15s ease-in-out infinite; }
        .hero-orb-3 { width: 350px; height: 350px; bottom: -80px; left: 38%; background: radial-gradient(circle, rgba(234,161,251,0.1), transparent 70%); animation: orbDrift3 10s ease-in-out infinite; }
        @keyframes orbDrift1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,20px)} }
        @keyframes orbDrift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px)} }
        @keyframes orbDrift3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(15px,-25px)} }

        /* El hero pasó a una sola columna centrada al sacarse el panel de
           métricas fabricadas que ocupaba la columna derecha. */
        .hero-container { display: flex; justify-content: center; position: relative; z-index: 1; }
        .hero-content { max-width: 760px; text-align: center; }
        .hero-subtitle-center { margin-left: auto; margin-right: auto; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(184,155,255,0.1); border: 1px solid rgba(184,155,255,0.25); border-radius: 999px; color: #C3B5FD; font-weight: 700; font-size: 0.82rem; margin-bottom: 24px; }
        .hero-title { font-size: clamp(2.4rem, 5vw, 4.2rem); line-height: 1.04; font-weight: 900; letter-spacing: -0.04em; color: white; margin-bottom: 20px; }
        .text-highlight { background: linear-gradient(135deg, #B89BFF, #EAA1FB, #FE8FD9); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline; }
        .hero-subtitle { color: #94A3B8; font-size: 1.15rem; line-height: 1.7; margin: 0 auto 32px; max-width: 620px; }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        /* ── BUTTONS ── */
        .btn-lima-cta { display: inline-flex; align-items: center; gap: 8px; padding: 15px 30px; background: #D2F23A; color: #0A0B10; font-weight: 800; font-size: 0.93rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.04em; transition: all 0.3s; text-decoration: none; }
        .btn-outline-dark { display: inline-flex; align-items: center; gap: 8px; padding: 15px 28px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.93rem; border-radius: 100px; transition: all 0.3s; text-decoration: none; }

        /* ── SERVICES ── */
        .services-section { padding: 100px 0; }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .service-card-premium { position: relative; overflow: hidden; padding: 36px 32px; background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.07); border-radius: 28px; cursor: default; transition: border-color 0.3s; }
        .service-card-premium:hover { border-color: rgba(184,155,255,0.25); }
        .svc-glow { position: absolute; top: 0; right: 0; width: 200px; height: 200px; pointer-events: none; }
        .svc-tag { display: inline-flex; padding: 5px 14px; border-radius: 999px; font-size: 0.73rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
        .service-icon-wrapper { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .service-card-premium h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.02em; }
        .service-card-premium p { font-size: 0.9rem; color: #94A3B8; line-height: 1.7; margin-bottom: 20px; }
        .svc-learn-more { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 700; }

        /* ── CHANNELS ── */
        .channels-section { padding: 100px 0; }
        .channels-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .channels-tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(210,242,58,0.1); border: 1px solid rgba(210,242,58,0.2); border-radius: 999px; color: #D2F23A; font-size: 0.8rem; font-weight: 700; margin-bottom: 20px; }
        .channels-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: white; letter-spacing: -0.04em; margin-bottom: 16px; }
        .channels-desc { color: #94A3B8; line-height: 1.7; margin-bottom: 24px; }
        .channels-list { display: flex; flex-direction: column; gap: 12px; }
        .channels-list-item { display: flex; align-items: center; gap: 10px; color: #CBD5E1; font-size: 0.9rem; }
        .channels-badges-wrap { position: relative; display: flex; flex-direction: column; align-items: center; }
        .channels-badges-bg { position: absolute; inset: -40px; background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%); pointer-events: none; }
        .channels-hint { font-size: 0.75rem; color: #4B5563; margin-top: 12px; }

        /* ── RECOVER ── */
        .recover-section { padding: 100px 0; background: linear-gradient(180deg, transparent, rgba(124,58,237,0.06) 50%, transparent); }
        .recover-header { text-align: center; margin-bottom: 64px; }
        .section-tag-recover { display: inline-flex; padding: 7px 18px; background: rgba(210,242,58,0.1); border: 1px solid rgba(210,242,58,0.25); border-radius: 999px; color: #D2F23A; font-size: 0.76rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
        .recover-title { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: white; letter-spacing: -0.05em; margin-bottom: 12px; }
        .recover-subtitle { font-size: 1.15rem; color: #B89BFF; font-style: italic; margin-bottom: 16px; }
        .recover-desc { color: #94A3B8; max-width: 600px; margin: 0 auto 28px; line-height: 1.7; }
        .recover-grid-visual { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 820px; margin: 0 auto; }
        .recover-card-premium { padding: 28px; background: rgba(255,255,255,0.024); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; transition: border-color 0.3s; cursor: default; }
        .recover-card-dot { width: 10px; height: 10px; border-radius: 50%; margin-bottom: 14px; }
        .recover-card-premium h4 { font-size: 1rem; font-weight: 800; margin-bottom: 8px; }
        .recover-card-premium p { font-size: 0.87rem; color: #94A3B8; line-height: 1.6; }

        /* ── CONTACT ── */
        .contact-section { padding: 100px 0; }
        .contact-pretitle { text-align: center; margin-bottom: 64px; }
        .contact-pretitle-tag { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; background: rgba(184,155,255,0.1); border: 1px solid rgba(184,155,255,0.25); border-radius: 999px; color: #C3B5FD; font-size: 0.82rem; font-weight: 700; margin-bottom: 20px; }
        .contact-pretitle-h2 { font-size: clamp(2.2rem, 4.5vw, 3.8rem); font-weight: 900; color: white; letter-spacing: -0.05em; line-height: 1.05; margin-bottom: 16px; }
        .contact-pretitle-sub { color: #94A3B8; font-size: 1.05rem; max-width: 560px; margin: 0 auto; line-height: 1.7; }
        .contact-wrapper { display: grid; grid-template-columns: 1fr 1.4fr; gap: 48px; align-items: start; }
        .contact-info { display: flex; flex-direction: column; gap: 24px; }
        .benefit-list { display: flex; flex-direction: column; gap: 16px; }
        .benefit-item { display: flex; align-items: center; gap: 12px; color: #CBD5E1; font-size: 0.9rem; }
        .benefit-icon { color: #D2F23A; flex-shrink: 0; }
        .form-card-container { background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 40px; backdrop-filter: blur(20px); }
        .form-steps-header { display: flex; gap: 10px; margin-bottom: 28px; }
        .step-indicator { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; background: rgba(255,255,255,0.06); color: #6B7280; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s; }
        .step-indicator.active { background: #835CE6; color: white; border-color: #835CE6; box-shadow: 0 0 20px rgba(131,92,230,0.4); }
        .step-indicator.completed { background: rgba(210,242,58,0.15); color: #D2F23A; border-color: rgba(210,242,58,0.3); }
        .multistep-form h3 { font-size: 1.15rem; font-weight: 800; color: white; margin-bottom: 20px; letter-spacing: -0.02em; }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .form-group label { font-size: 0.82rem; font-weight: 600; color: #94A3B8; }
        .form-group input { padding: 14px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: white; font-size: 0.93rem; font-family: inherit; outline: none; transition: border-color 0.3s; }
        .form-group input:focus { border-color: rgba(184,155,255,0.5); background: rgba(184,155,255,0.05); }
        .form-group input::placeholder { color: #4B5563; }
        .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .option-btn { padding: 14px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; color: #94A3B8; font-size: 0.87rem; font-weight: 600; text-align: left; cursor: pointer; font-family: inherit; transition: all 0.25s; }
        .option-btn:hover { border-color: rgba(184,155,255,0.4); color: #C3B5FD; background: rgba(184,155,255,0.06); }
        .option-btn.selected { border-color: rgba(184,155,255,0.6); background: rgba(184,155,255,0.12); color: #C3B5FD; }
        .form-navigation { display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px; }
        .btn-back { padding: 12px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #6B7280; border-radius: 12px; font-size: 0.88rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.25s; }
        .btn-back:hover { color: #CBD5E1; border-color: rgba(255,255,255,0.2); }
        .btn-next { padding: 12px 24px; background: rgba(184,155,255,0.15); border: 1px solid rgba(184,155,255,0.35); color: #C3B5FD; border-radius: 12px; font-size: 0.88rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.25s; }
        .btn-next:hover { background: rgba(184,155,255,0.25); }
        .btn-submit-form { padding: 14px 28px; background: linear-gradient(135deg, #B89BFF, #835CE6); border: none; color: white; border-radius: 12px; font-size: 0.93rem; font-weight: 800; cursor: pointer; font-family: inherit; transition: all 0.3s; }
        .btn-submit-form:disabled { opacity: 0.6; cursor: not-allowed; }
        .status-banner { padding: 14px 16px; border-radius: 12px; font-size: 0.88rem; font-weight: 600; margin-bottom: 16px; }
        .status-banner.success { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.25); color: #4ade80; }
        .status-banner.error { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; }
        .form-step { min-height: 200px; }

        /* ── FAQ ── */
        .faq-section { padding: 80px 0 120px; }
        .max-w-3xl { max-width: 760px; margin-left: auto; margin-right: auto; }
        .faq-list { display: flex; flex-direction: column; gap: 0; }
        .faq-item-premium { border-bottom: 1px solid rgba(255,255,255,0.07); }
        .faq-trigger { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 22px 0; color: #E2E8F0; font-size: 0.97rem; font-weight: 600; text-align: left; cursor: pointer; font-family: inherit; gap: 20px; background: transparent; border: none; transition: color 0.25s; }
        .faq-icon { flex-shrink: 0; color: #6B7280; display: flex; align-items: center; }
        .faq-answer { padding: 0 0 20px; }
        .faq-answer p { color: #94A3B8; line-height: 1.75; font-size: 0.93rem; }

        /* ── SECTION HEADER ── */
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-tag { display: inline-flex; padding: 7px 18px; background: rgba(184,155,255,0.1); border: 1px solid rgba(184,155,255,0.2); border-radius: 999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #B89BFF; margin-bottom: 16px; }
        .section-title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 900; color: white; letter-spacing: -0.04em; margin-bottom: 16px; }
        .section-subtitle { font-size: 1.05rem; color: #94A3B8; max-width: 580px; margin: 0 auto; line-height: 1.75; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .channels-grid { grid-template-columns: 1fr; gap: 48px; }
          .contact-wrapper { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .hero-section { padding: 120px 0 80px; }
          .services-grid { grid-template-columns: 1fr; }
          .recover-grid-visual { grid-template-columns: 1fr; }
          .options-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </>
  );
}
