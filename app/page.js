'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight, CheckCircle2, Sparkles, TrendingUp, Search,
  Database, Cpu, Zap, Plus, Minus, Star, Quote, BarChart3,
  Users, Award, Megaphone, ChevronRight,
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
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
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
    title: 'Sistemas CRM & IA',
    desc: 'Automatizamos la gestión comercial de tu negocio integrando CRM a medida y asistentes de Inteligencia Artificial para atención y cierre de ventas.',
    tag: 'Tecnología',
    tagColor: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.25)',
  },
  {
    icon: TrendingUp,
    title: 'Adquisición & Pauta Inteligente',
    desc: 'Diseñamos y optimizamos campañas de Meta & Google Ads basadas en datos, enfocadas exclusivamente en retorno de inversión y escala.',
    tag: 'Performance',
    tagColor: '#D2F23A',
    accent: 'rgba(210,242,58,0.08)',
    border: 'rgba(210,242,58,0.2)',
  },
  {
    icon: Database,
    title: 'Automatización & Datos',
    desc: 'Conectamos tus herramientas en piloto automático. Automatizamos reportes, facturación, y flujos de trabajo para ahorrar cientos de horas mensuales.',
    tag: 'Eficiencia',
    tagColor: '#EAA1FB',
    accent: 'rgba(234,161,251,0.08)',
    border: 'rgba(234,161,251,0.2)',
  },
];

const RECOVER_ITEMS = [
  { title: 'Clientes Inactivos', desc: 'Reactivamos cuentas que compraron en el pasado pero dejaron de interactuar.', color: '#B89BFF' },
  { title: 'Leads Abandonados', desc: 'Recuperamos contactos que consultaron pero nunca concretaron por falta de seguimiento.', color: '#D2F23A' },
  { title: 'Ventas Perdidas', desc: 'Analizamos propuestas rechazadas para renegociar con ofertas automatizadas.', color: '#EAA1FB' },
  { title: 'Bases de Datos Frías', desc: 'Explotamos bases de correos y teléfonos archivadas mediante secuencias inteligentes.', color: '#FE8FD9' },
];

const STATS = [
  { value: '+20', label: 'Marcas asesoradas', icon: Users, color: '#D2F23A', glow: 'rgba(210,242,58,0.3)' },
  { value: '+275%', label: 'Aumento en ventas', icon: TrendingUp, color: '#B89BFF', glow: 'rgba(184,155,255,0.3)' },
  { value: '3x', label: 'ROI promedio', icon: BarChart3, color: '#EAA1FB', glow: 'rgba(234,161,251,0.3)' },
  { value: '+6', label: 'Años de experiencia', icon: Award, color: '#D2F23A', glow: 'rgba(210,242,58,0.3)' },
];

const TESTIMONIALS = [
  {
    name: 'Martina González',
    role: 'CEO · Boutique Aurea',
    initials: 'MG',
    text: 'En 3 meses, NEXA duplicó nuestras ventas online. El CRM personalizado que desarrollaron cambió totalmente la forma en que gestionamos clientes.',
    metric: '+210% ventas',
    metricColor: '#D2F23A',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Director · TechFlow Solutions',
    initials: 'CR',
    text: 'Las campañas de Google Ads que gestionan tienen el mejor ROI que he visto en 8 años. Resultados medibles desde el primer mes de trabajo.',
    metric: '4.1x ROI',
    metricColor: '#B89BFF',
  },
  {
    name: 'Valentina Méndez',
    role: 'Fundadora · Estudio Vivo',
    initials: 'VM',
    text: 'La estrategia de contenido transformó nuestra marca. Pasamos de 2k a 28k seguidores orgánicos en solo 6 meses trabajando con NEXA.',
    metric: '+1300% seguidores',
    metricColor: '#EAA1FB',
  },
];

const CHANNEL_FEATURES = [
  'Estrategia multicanal integrada',
  'Campañas optimizadas con IA generativa',
  'Optimización continua basada en datos',
  'Reportes semanales 100% transparentes',
];

const FAQS = [
  {
    question: '¿Qué diferencia a NEXA de una agencia de marketing tradicional?',
    answer: 'No somos una agencia boutique que hace posteos estéticos. Somos una consultora tecnológica que integra desarrollo de software, CRM, automatización de procesos con IA y adquisición paga orientada a datos y crecimiento de negocio medible.',
  },
  {
    question: '¿Cómo funciona la integración con nuestro negocio?',
    answer: 'Realizamos una inmersión técnica inicial, implementamos el ecosistema digital a medida (CRM, embudos, integraciones API) y capacitamos a tu equipo. Todo queda centralizado en una sola plataforma operativa.',
  },
  {
    question: '¿Qué es NEXA Recover y cuándo veo resultados?',
    answer: 'NEXA Recover es nuestro sistema especializado en reactivar oportunidades comerciales dormidas en tu base de datos mediante automatización. Los resultados suelen verse en los primeros 30 días.',
  },
  {
    question: '¿Cuáles son los requisitos técnicos para empezar?',
    answer: 'Ninguno por tu parte. Nosotros nos encargamos de las integraciones con tus canales actuales (WhatsApp, Email, CRM existente) utilizando APIs seguras.',
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

/* ─── Count-Up Hook ─── */
function useCountUp(target, duration = 1.5, inView) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    if (!num) return;
    let start = 0;
    const step = num / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= num) { setCount(num); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  const prefix = target.match(/^\+/) ? '+' : '';
  const suffix = target.match(/%$/) ? '%' : target.match(/x$/) ? 'x' : '';
  return `${prefix}${count}${suffix}`;
}

/* ─── Stat Item ─── */
function StatItem({ stat, index }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const Icon = stat.icon;
  const display = useCountUp(stat.value, 1.5, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={index}
      className="stat-item-premium"
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      <div className="stat-icon-ring" style={{ background: `${stat.color}18`, boxShadow: `0 0 0 1px ${stat.color}30` }}>
        <Icon size={22} color={stat.color} />
      </div>
      <div className="stat-value-premium" style={{ color: stat.color }}>{display}</div>
      <div className="stat-label-premium">{stat.label}</div>
    </motion.div>
  );
}

/* ─── Page ─── */
export default function HomePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: 'CRM & Automatización',
    companyName: '',
    website: '',
    goals: 'Optimizar Procesos',
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
      setFormData({ service: 'CRM & Automatización', companyName: '', website: '', goals: 'Optimizar Procesos', contactName: '', contactEmail: '', contactPhone: '' });
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
                <span>Ecosistemas de Crecimiento Tecnológico</span>
              </motion.div>

              <motion.h1 variants={fadeUp} className="hero-title">
                Transformamos marketing, seguimiento comercial y datos en{' '}
                <span className="text-highlight">crecimiento medible.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="hero-subtitle">
                Integramos CRM, IA y pauta inteligente en un solo ecosistema digital que convierte datos en ventas reales.
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

              <motion.div variants={fadeUp} className="hero-metrics">
                {[
                  { icon: Users, label: '+20 Marcas activas', color: '#B89BFF', bg: 'rgba(184,155,255,0.12)' },
                  { icon: Star, label: '3x ROI Promedio', color: '#EAA1FB', bg: 'rgba(234,161,251,0.12)' },
                  { icon: TrendingUp, label: '+275% en ventas', color: '#D2F23A', bg: 'rgba(210,242,58,0.12)' },
                ].map(({ icon: Icon, label, color, bg }) => (
                  <div key={label} className="metric-chip">
                    <div className="metric-chip-icon" style={{ background: bg }}>
                      <Icon size={14} color={color} />
                    </div>
                    <span className="metric-chip-label">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Dashboard visual */}
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, x: 60, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="dashboard-card"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="dash-header">
                  <div>
                    <div className="dash-eyebrow">RENDIMIENTO MENSUAL</div>
                    <div className="dash-value">+<span className="dash-lima">127</span>%</div>
                  </div>
                  <div className="dash-badge-up">↑ En alza</div>
                </div>
                <div className="dash-chart-wrap">
                  <svg viewBox="0 0 340 90" className="dash-chart" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D2F23A" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#D2F23A" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,80 C40,72 70,55 110,44 S160,30 200,20 S260,8 340,4" fill="none" stroke="#D2F23A" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M0,80 C40,72 70,55 110,44 S160,30 200,20 S260,8 340,4 L340,90 L0,90 Z" fill="url(#chartFill)" />
                    <circle cx="340" cy="4" r="5" fill="#D2F23A" />
                    <circle cx="340" cy="4" r="10" fill="#D2F23A" fillOpacity="0.2" />
                  </svg>
                </div>
                <div className="dash-metrics">
                  {[
                    { val: '248', label: 'Leads', color: 'white', bg: 'rgba(255,255,255,0.04)' },
                    { val: '73%', label: 'Conversión', color: '#D2F23A', bg: 'rgba(210,242,58,0.08)' },
                    { val: '3.8x', label: 'ROI', color: '#B89BFF', bg: 'rgba(184,155,255,0.08)' },
                  ].map(({ val, label, color, bg }) => (
                    <div key={label} className="dash-metric-cell" style={{ background: bg }}>
                      <div className="dash-metric-val" style={{ color }}>{val}</div>
                      <div className="dash-metric-label">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="dash-bars">
                  {[
                    { label: 'Google Ads', pct: 84, color: '#D2F23A' },
                    { label: 'Meta Ads', pct: 67, color: '#B89BFF' },
                    { label: 'Email Mktg', pct: 91, color: '#EAA1FB' },
                  ].map((b) => (
                    <div key={b.label} className="dash-bar-row">
                      <span className="dash-bar-label">{b.label}</span>
                      <div className="dash-bar-track">
                        <motion.div
                          className="dash-bar-fill"
                          style={{ background: b.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${b.pct}%` }}
                          transition={{ duration: 1.2, delay: 0.8 + Math.random() * 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                      <span className="dash-bar-pct">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="float-chip float-chip-top"
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="float-dot" />
                <div>
                  <div className="float-chip-title">Nuevo cliente</div>
                  <div className="float-chip-sub">Empresa XYZ firmó propuesta</div>
                </div>
              </motion.div>

              <motion.div
                className="float-chip float-chip-bottom"
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div>
                  <div className="float-chip-sub">ROI último mes</div>
                  <div className="float-chip-title" style={{ fontSize: '1.4rem', color: '#D2F23A' }}>3.2x</div>
                  <div style={{ fontSize: '0.72rem', color: '#4ade80' }}>↑ +45% vs mes anterior</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════ CLIENTS STRIP ══════ */}
        <motion.section
          className="clients-strip"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="container">
            <p className="clients-title">Infraestructura comercial validada en múltiples industrias</p>
            <div className="clients-row">
              {['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estética Funcional', 'Aqualaf'].map((name, i) => (
                <motion.div
                  key={name}
                  className="client-logo-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ borderColor: 'rgba(184,155,255,0.4)', y: -3 }}
                >
                  {name}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══════ STATS ══════ */}
        <section className="stats-bar">
          <div className="container">
            <motion.div
              className="stats-grid-premium"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
            >
              {STATS.map((stat, i) => <StatItem key={stat.label} stat={stat} index={i} />)}
            </motion.div>
          </div>
        </section>

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
              <motion.h2 variants={fadeUp} className="section-title">Nuestra Suite Tecnológica</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle">
                Reemplazamos los procesos manuales por sistemas escalables orientados a conversión.
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
                  <motion.article
                    key={service.title}
                    variants={scaleIn}
                    className="service-card-premium"
                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                    style={{ '--card-accent': service.tagColor, '--card-glow': service.accent }}
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
                      <span>Saber más</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.article>
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

        {/* ══════ TESTIMONIALS ══════ */}
        <section className="testimonials-section">
          <div className="container">
            <motion.div
              className="section-header"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.span variants={fadeUp} className="section-tag" style={{ background: 'rgba(210,242,58,0.12)', color: '#D2F23A' }}>Resultados reales</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Lo que dicen nuestros clientes</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle">
                Más de 20 empresas ya escalaron su negocio con NEXA. Estos son algunos de sus testimonios.
              </motion.p>
            </motion.div>

            <motion.div
              className="testimonials-grid"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
            >
              {TESTIMONIALS.map((t) => (
                <motion.div
                  key={t.name}
                  variants={scaleIn}
                  className="testimonial-card-premium"
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                      >
                        <Star size={13} fill="#D2F23A" color="#D2F23A" />
                      </motion.span>
                    ))}
                  </div>
                  <Quote size={20} className="testimonial-quote-icon" style={{ color: 'rgba(184,155,255,0.4)' }} />
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-footer">
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">{t.initials}</div>
                      <div>
                        <div className="testimonial-name">{t.name}</div>
                        <div className="testimonial-role">{t.role}</div>
                      </div>
                    </div>
                    <div className="testimonial-metric" style={{ color: t.metricColor }}>{t.metric}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

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
                    'Conexión directa con tu CRM actual',
                    'Análisis de base de datos sin cargo',
                    'Reporte de automatización personalizado',
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
                <div className="contact-live-card">
                  <div className="contact-live-dot" />
                  <div>
                    <div className="contact-live-title">+8 empresas esta semana</div>
                    <div className="contact-live-sub">ya solicitaron su diagnóstico</div>
                  </div>
                </div>
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
                          {['CRM & Automatización', 'Pauta Paga Ads', 'Nexa Recover', 'Consultoría Técnica Completa'].map((srv) => (
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
                          {['Optimizar Procesos', 'Duplicar Ventas de Leads', 'Recuperar Clientes Inactivos', 'Automatizar Flujos / Ahorrar Tiempo'].map((goal) => (
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

        .hero-container { display: grid; grid-template-columns: 1.1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 1; }
        .hero-content { max-width: 650px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(184,155,255,0.1); border: 1px solid rgba(184,155,255,0.25); border-radius: 999px; color: #C3B5FD; font-weight: 700; font-size: 0.82rem; margin-bottom: 24px; }
        .hero-title { font-size: clamp(2.4rem, 5vw, 4.2rem); line-height: 1.04; font-weight: 900; letter-spacing: -0.04em; color: white; margin-bottom: 20px; }
        .text-highlight { background: linear-gradient(135deg, #B89BFF, #EAA1FB, #FE8FD9); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline; }
        .hero-subtitle { color: #94A3B8; font-size: 1.15rem; line-height: 1.7; margin-bottom: 32px; max-width: 540px; }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-metrics { display: flex; gap: 10px; margin-top: 32px; flex-wrap: wrap; }
        .metric-chip { display: flex; align-items: center; gap: 8px; padding: 8px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; backdrop-filter: blur(10px); }
        .metric-chip-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .metric-chip-label { font-size: 0.78rem; font-weight: 600; color: #CBD5E1; }

        /* Dashboard */
        .hero-visual { position: relative; }
        .dashboard-card { background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; padding: 28px; box-shadow: 0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset; backdrop-filter: blur(20px); }
        .dash-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .dash-eyebrow { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; color: #505466; margin-bottom: 4px; }
        .dash-value { font-size: 2.6rem; font-weight: 900; color: white; letter-spacing: -0.05em; }
        .dash-lima { color: #D2F23A; }
        .dash-badge-up { padding: 6px 14px; background: rgba(74,222,128,0.12); color: #4ade80; font-size: 0.76rem; font-weight: 700; border-radius: 999px; border: 1px solid rgba(74,222,128,0.22); }
        .dash-chart-wrap { margin-bottom: 16px; }
        .dash-chart { width: 100%; height: 90px; }
        .dash-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }
        .dash-metric-cell { border-radius: 14px; padding: 12px; text-align: center; }
        .dash-metric-val { font-weight: 800; font-size: 1.1rem; line-height: 1; }
        .dash-metric-label { font-size: 0.68rem; color: #64748B; margin-top: 3px; }
        .dash-bars { display: flex; flex-direction: column; gap: 8px; }
        .dash-bar-row { display: flex; align-items: center; gap: 10px; }
        .dash-bar-label { font-size: 0.7rem; color: #64748B; width: 90px; flex-shrink: 0; }
        .dash-bar-track { flex: 1; height: 5px; background: rgba(255,255,255,0.07); border-radius: 999px; overflow: hidden; }
        .dash-bar-fill { height: 100%; border-radius: 999px; }
        .dash-bar-pct { font-size: 0.7rem; color: #505466; width: 28px; text-align: right; }
        .float-chip { position: absolute; display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(16,17,26,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px); }
        .float-chip-top { top: -16px; right: -24px; }
        .float-chip-bottom { bottom: -16px; left: -24px; }
        .float-dot { width: 8px; height: 8px; border-radius: 50%; background: #4ade80; animation: pulseDot 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5)} 50%{box-shadow:0 0 0 7px rgba(74,222,128,0)} }
        .float-chip-title { font-weight: 700; font-size: 0.82rem; color: white; }
        .float-chip-sub { font-size: 0.68rem; color: #64748B; margin-top: 1px; }

        /* ── BUTTONS ── */
        .btn-lima-cta { display: inline-flex; align-items: center; gap: 8px; padding: 15px 30px; background: #D2F23A; color: #0A0B10; font-weight: 800; font-size: 0.93rem; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.04em; transition: all 0.3s; text-decoration: none; }
        .btn-outline-dark { display: inline-flex; align-items: center; gap: 8px; padding: 15px 28px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.8); font-weight: 700; font-size: 0.93rem; border-radius: 100px; transition: all 0.3s; text-decoration: none; }

        /* ── CLIENTS ── */
        .clients-strip { padding: 48px 0; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
        .clients-title { text-align: center; font-size: 0.78rem; font-weight: 600; color: #4B5563; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 28px; }
        .clients-row { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; align-items: center; }
        .client-logo-card { padding: 10px 22px; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; color: #6B7280; font-size: 0.85rem; font-weight: 700; background: rgba(255,255,255,0.02); transition: all 0.3s; cursor: default; }

        /* ── STATS ── */
        .stats-bar { padding: 80px 0; }
        .stats-grid-premium { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .stat-item-premium { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 32px 24px; background: rgba(255,255,255,0.024); border: 1px solid rgba(255,255,255,0.07); border-radius: 24px; cursor: default; transition: border-color 0.3s; }
        .stat-icon-ring { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .stat-value-premium { font-size: 2.6rem; font-weight: 900; letter-spacing: -0.05em; line-height: 1; margin-bottom: 6px; }
        .stat-label-premium { font-size: 0.82rem; color: #6B7280; font-weight: 500; }

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

        /* ── TESTIMONIALS ── */
        .testimonials-section { padding: 100px 0; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card-premium { padding: 32px; background: rgba(255,255,255,0.028); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; display: flex; flex-direction: column; gap: 16px; cursor: default; transition: border-color 0.3s; }
        .testimonial-card-premium:hover { border-color: rgba(184,155,255,0.2); }
        .testimonial-stars { display: flex; gap: 4px; }
        .testimonial-quote-icon { opacity: 0.35; }
        .testimonial-text { font-size: 0.92rem; color: #CBD5E1; line-height: 1.75; flex: 1; }
        .testimonial-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar { width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #835CE6, #EAA1FB); display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 800; color: white; flex-shrink: 0; }
        .testimonial-name { font-weight: 700; font-size: 0.88rem; color: white; }
        .testimonial-role { font-size: 0.72rem; color: #6B7280; margin-top: 2px; }
        .testimonial-metric { font-weight: 900; font-size: 0.88rem; font-variant-numeric: tabular-nums; }

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
        .contact-live-card { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: rgba(74,222,128,0.06); border: 1px solid rgba(74,222,128,0.15); border-radius: 16px; }
        .contact-live-dot { width: 10px; height: 10px; border-radius: 50%; background: #4ade80; animation: pulseDot 2s ease-in-out infinite; flex-shrink: 0; }
        .contact-live-title { font-weight: 700; font-size: 0.9rem; color: white; }
        .contact-live-sub { font-size: 0.75rem; color: #6B7280; margin-top: 2px; }
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
          .hero-container { grid-template-columns: 1fr; gap: 60px; }
          .hero-visual { max-width: 520px; margin: 0 auto; }
          .stats-grid-premium { grid-template-columns: repeat(2, 1fr); }
          .services-grid { grid-template-columns: repeat(2, 1fr); }
          .channels-grid { grid-template-columns: 1fr; gap: 48px; }
          .contact-wrapper { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .hero-section { padding: 120px 0 80px; }
          .services-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .recover-grid-visual { grid-template-columns: 1fr; }
          .stats-grid-premium { grid-template-columns: repeat(2, 1fr); }
          .float-chip-top, .float-chip-bottom { display: none; }
          .options-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </>
  );
}
