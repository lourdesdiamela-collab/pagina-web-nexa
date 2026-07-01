'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Search,
  Database,
  Cpu,
  Zap,
  Plus,
  Minus,
  Star,
  Quote,
  BarChart3,
  Users,
  Award,
  Megaphone,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { MarketingBadges } from '@/components/ui/marketing-badges';

/* ─── Data ─── */
const SERVICES = [
  {
    icon: Cpu,
    title: 'Sistemas CRM & IA',
    desc: 'Automatizamos la gestión comercial de tu negocio integrando CRM a medida y asistentes de Inteligencia Artificial para atención y cierre de ventas.',
    tag: 'Tecnología',
    tagColor: '#B89BFF',
  },
  {
    icon: TrendingUp,
    title: 'Adquisición & Pauta Inteligente',
    desc: 'Diseñamos y optimizamos campañas de Meta & Google Ads basadas en datos, enfocadas exclusivamente en retorno de inversión y escala.',
    tag: 'Performance',
    tagColor: '#D2F23A',
  },
  {
    icon: Database,
    title: 'Automatización & Datos',
    desc: 'Conectamos tus herramientas en piloto automático. Automatizamos reportes, facturación, y flujos de trabajo para ahorrar cientos de horas mensuales.',
    tag: 'Eficiencia',
    tagColor: '#EAA1FB',
  },
];

const RECOVER_ITEMS = [
  { title: 'Clientes Inactivos', desc: 'Reactivamos cuentas que compraron en el pasado pero dejaron de interactuar.' },
  { title: 'Leads Abandonados', desc: 'Recuperamos contactos que consultaron pero nunca concretaron por falta de seguimiento.' },
  { title: 'Ventas Perdidas', desc: 'Analizamos propuestas rechazadas para renegociar con ofertas automatizadas.' },
  { title: 'Bases de Datos Frías', desc: 'Explotamos bases de correos y teléfonos archivadas mediante secuencias inteligentes.' },
];

const STATS = [
  { value: '+20', label: 'Marcas asesoradas', icon: Users, color: '#D2F23A' },
  { value: '+275%', label: 'Aumento en ventas', icon: TrendingUp, color: '#B89BFF' },
  { value: '3x', label: 'ROI promedio', icon: BarChart3, color: '#EAA1FB' },
  { value: '+6', label: 'Años de experiencia', icon: Award, color: '#D2F23A' },
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

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main className="landing-main">

        {/* ══════════════════════════════════
            HERO
        ══════════════════════════════════ */}
        <section className="hero-section">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />

          <div className="container hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={14} />
                <span>Ecosistemas de Crecimiento Tecnológico</span>
              </div>
              <h1 className="hero-title">
                Transformamos marketing, seguimiento comercial y datos en{' '}
                <span className="text-highlight">crecimiento medible.</span>
              </h1>
              <p className="hero-subtitle">
                Diseñamos e implementamos la infraestructura digital que automatiza tus ventas,
                organiza tus clientes con CRM inteligente y recupera facturación perdida.
              </p>
              <div className="hero-actions">
                <a href="#contacto" className="btn-lima-cta">
                  Iniciar Diagnóstico
                  <ArrowRight size={18} />
                </a>
                <a href="#servicios" className="btn-outline-dark">
                  Ver Soluciones
                </a>
              </div>

              <div className="hero-metrics">
                <div className="metric-chip">
                  <div className="metric-chip-icon" style={{ background: 'rgba(210,242,58,0.12)' }}>
                    <TrendingUp size={14} color="#D2F23A" />
                  </div>
                  <div>
                    <div className="metric-chip-value">+275%</div>
                    <div className="metric-chip-label">Ventas promedio</div>
                  </div>
                </div>
                <div className="metric-chip">
                  <div className="metric-chip-icon" style={{ background: 'rgba(184,155,255,0.12)' }}>
                    <Users size={14} color="#B89BFF" />
                  </div>
                  <div>
                    <div className="metric-chip-value">+20</div>
                    <div className="metric-chip-label">Marcas activas</div>
                  </div>
                </div>
                <div className="metric-chip">
                  <div className="metric-chip-icon" style={{ background: 'rgba(234,161,251,0.12)' }}>
                    <Star size={14} color="#EAA1FB" />
                  </div>
                  <div>
                    <div className="metric-chip-value">3x ROI</div>
                    <div className="metric-chip-label">Promedio clientes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="dashboard-card">
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
                        <stop offset="0%" stopColor="#D2F23A" stopOpacity="0.2" />
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
                  <div className="dash-metric-cell">
                    <div className="dash-metric-val">248</div>
                    <div className="dash-metric-label">Leads</div>
                  </div>
                  <div className="dash-metric-cell dash-metric-lima">
                    <div className="dash-metric-val" style={{ color: '#D2F23A' }}>73%</div>
                    <div className="dash-metric-label">Conversión</div>
                  </div>
                  <div className="dash-metric-cell dash-metric-lilac">
                    <div className="dash-metric-val" style={{ color: '#B89BFF' }}>3.8x</div>
                    <div className="dash-metric-label">ROI</div>
                  </div>
                </div>

                <div className="dash-bars">
                  {[
                    { label: 'Google Ads', pct: 84, color: '#D2F23A' },
                    { label: 'Meta Ads', pct: 67, color: '#B89BFF' },
                    { label: 'Email Marketing', pct: 91, color: '#EAA1FB' },
                  ].map((b) => (
                    <div key={b.label} className="dash-bar-row">
                      <span className="dash-bar-label">{b.label}</span>
                      <div className="dash-bar-track">
                        <div className="dash-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                      </div>
                      <span className="dash-bar-pct">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="float-chip float-chip-top">
                <div className="float-dot" />
                <div>
                  <div className="float-chip-title">Nuevo cliente</div>
                  <div className="float-chip-sub">Empresa XYZ firmó propuesta</div>
                </div>
              </div>
              <div className="float-chip float-chip-bottom">
                <div>
                  <div className="float-chip-sub">ROI último mes</div>
                  <div className="float-chip-title" style={{ fontSize: '1.4rem', color: '#D2F23A' }}>3.2x</div>
                  <div style={{ fontSize: '0.72rem', color: '#4ade80' }}>↑ +45% vs mes anterior</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            CLIENTS STRIP
        ══════════════════════════════════ */}
        <section className="clients-strip">
          <div className="container">
            <p className="clients-title">Infraestructura comercial validada en múltiples industrias</p>
            <div className="clients-row">
              {['Ciudad Moto', 'Corven Motos', 'Roca Viviendas', 'Casa Diez', 'Estética Funcional', 'Aqualaf'].map((name) => (
                <div key={name} className="client-logo-card">{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            STATS BAR
        ══════════════════════════════════ */}
        <section className="stats-bar">
          <div className="container stats-grid">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="stat-item">
                  <div className="stat-icon-wrap" style={{ background: `${stat.color}18` }}>
                    <Icon size={20} color={stat.color} />
                  </div>
                  <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════
            SERVICES
        ══════════════════════════════════ */}
        <section id="servicios" className="services-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Soluciones</span>
              <h2 className="section-title">Nuestra Suite Tecnológica</h2>
              <p className="section-subtitle">
                Reemplazamos los procesos manuales por sistemas escalables orientados a conversión.
              </p>
            </div>
            <div className="services-grid">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <article key={service.title} className="service-card-v2">
                    <div className="svc-tag" style={{ color: service.tagColor, background: `${service.tagColor}18`, border: `1px solid ${service.tagColor}30` }}>
                      {service.tag}
                    </div>
                    <div className="service-icon-wrapper">
                      <Icon size={28} />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <div className="svc-learn-more">
                      <span>Saber más</span>
                      <ArrowRight size={14} />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            MARKETING CHANNELS (BADGES)
        ══════════════════════════════════ */}
        <section id="canales" className="channels-section">
          <div className="container">
            <div className="channels-grid">
              <div className="channels-text">
                <div className="channels-tag">
                  <Megaphone size={14} />
                  <span>Marketing 360°</span>
                </div>
                <h2 className="channels-title">
                  Dominamos cada canal para{' '}
                  <span style={{ background: 'linear-gradient(135deg, #D2F23A, #EAA1FB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    maximizar tu alcance
                  </span>
                </h2>
                <p className="channels-desc">
                  Desde SEO hasta redes sociales, email marketing y publicidad paga.
                  Nuestra agencia cubre todos los frentes para que ninguna oportunidad de crecimiento se escape.
                </p>
                <ul className="channels-list">
                  {CHANNEL_FEATURES.map((item) => (
                    <li key={item} className="channels-list-item">
                      <CheckCircle2 size={15} color="#D2F23A" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contacto" className="btn-lima-cta" style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', padding: '14px 28px' }}>
                  Armar mi estrategia
                  <ArrowRight size={16} />
                </a>
              </div>

              <div className="channels-badges-wrap">
                <div className="channels-badges-bg" />
                <MarketingBadges />
                <p className="channels-hint">Interactuá con los canales</p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            NEXA RECOVER
        ══════════════════════════════════ */}
        <section className="recover-section">
          <div className="container recover-container">
            <div className="recover-content">
              <span className="section-tag-recover">Premium Feature</span>
              <h2 className="recover-title">NEXA Recover</h2>
              <p className="recover-subtitle">&ldquo;Recuperamos oportunidades que ya existen dentro de tu negocio.&rdquo;</p>
              <p className="recover-desc">
                Antes de gastar más en publicidad, explotamos el oro oculto en tu base de datos actual.
                Implementamos secuencias de reactivación y bots comerciales inteligentes para recuperar facturación estancada.
              </p>
              <a href="#contacto" onClick={() => selectService('Nexa Recover')} className="btn-lima-cta">
                Recuperar Base de Datos
                <ArrowRight size={18} />
              </a>
            </div>
            <div className="recover-grid-visual">
              {RECOVER_ITEMS.map((item, idx) => (
                <div key={idx} className="recover-card">
                  <div className="recover-card-dot" />
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════ */}
        <section className="testimonials-section">
          <div className="container">
            <div className="section-header">
              <span className="section-tag" style={{ background: 'rgba(210,242,58,0.12)', color: '#D2F23A' }}>Resultados reales</span>
              <h2 className="section-title">Lo que dicen nuestros clientes</h2>
              <p className="section-subtitle">
                Más de 20 empresas ya escalaron su negocio con NEXA. Estos son algunos de sus testimonios.
              </p>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="testimonial-card">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#D2F23A" color="#D2F23A" />
                    ))}
                  </div>
                  <Quote size={20} className="testimonial-quote-icon" />
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            CONTACT / MULTISTEP FORM
        ══════════════════════════════════ */}
        <section id="contacto" className="contact-section">
          <div className="container">
            <div className="contact-pretitle">
              <div className="contact-pretitle-tag">
                <Sparkles size={14} />
                Consultoría gratuita · Sin compromiso
              </div>
              <h2 className="contact-pretitle-h2">
                Diseñemos tu <br />
                <span className="text-highlight">Próximo Paso.</span>
              </h2>
              <p className="contact-pretitle-sub">
                Completá el diagnóstico rápido. En menos de 24hs un estratega de NEXA te contacta
                con un análisis personalizado de tu negocio.
              </p>
            </div>

            <div className="contact-wrapper">
              <div className="contact-info">
                <div className="benefit-list">
                  <div className="benefit-item">
                    <CheckCircle2 size={18} className="benefit-icon" />
                    <span>Conexión directa con tu CRM actual</span>
                  </div>
                  <div className="benefit-item">
                    <CheckCircle2 size={18} className="benefit-icon" />
                    <span>Análisis de base de datos sin cargo</span>
                  </div>
                  <div className="benefit-item">
                    <CheckCircle2 size={18} className="benefit-icon" />
                    <span>Reporte de automatización personalizado</span>
                  </div>
                </div>

                <div className="contact-live-card">
                  <div className="contact-live-dot" />
                  <div>
                    <div className="contact-live-title">+8 empresas esta semana</div>
                    <div className="contact-live-sub">ya solicitaron su diagnóstico</div>
                  </div>
                </div>
              </div>

              <div className="form-card-container">
                <div className="form-steps-header">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`step-indicator ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                      {step > s ? '✓' : s}
                    </div>
                  ))}
                </div>

                <form onSubmit={submitForm} className="multistep-form">
                  {status === 'ok' && (
                    <div className="status-banner success">
                      ¡Diagnóstico enviado con éxito! Nos comunicaremos en las próximas 24 horas.
                    </div>
                  )}
                  {status === 'error' && (
                    <div className="status-banner error">
                      Ocurrió un error al enviar. Por favor, intentalo de nuevo.
                    </div>
                  )}

                  {step === 1 && (
                    <div className="form-step animate-fade">
                      <h3>¿Qué solución necesitás prioritariamente?</h3>
                      <div className="options-grid">
                        {['CRM & Automatización', 'Pauta Paga Ads', 'Nexa Recover', 'Consultoría Técnica Completa'].map((srv) => (
                          <button key={srv} type="button" className={`option-btn ${formData.service === srv ? 'selected' : ''}`} onClick={() => selectService(srv)}>
                            {srv}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="form-step animate-fade">
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
                        <button type="button" onClick={nextStep} className="btn-next">Siguiente</button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="form-step animate-fade">
                      <h3>¿Cuál es tu objetivo comercial principal?</h3>
                      <div className="options-grid">
                        {['Optimizar Procesos', 'Duplicar Ventas de Leads', 'Recuperar Clientes Inactivos', 'Automatizar Flujos / Ahorrar Tiempo'].map((goal) => (
                          <button key={goal} type="button" className={`option-btn ${formData.goals === goal ? 'selected' : ''}`} onClick={() => selectGoal(goal)}>
                            {goal}
                          </button>
                        ))}
                      </div>
                      <div className="form-navigation">
                        <button type="button" onClick={prevStep} className="btn-back">Atrás</button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="form-step animate-fade">
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
                        <button type="submit" disabled={sending} className="btn-submit-form">
                          {sending ? 'Procesando...' : 'Iniciar Diagnóstico'}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════
            FAQ
        ══════════════════════════════════ */}
        <section className="faq-section">
          <div className="container max-w-3xl">
            <div className="section-header">
              <span className="section-tag">Dudas</span>
              <h2 className="section-title">Preguntas Frecuentes</h2>
            </div>
            <div className="faq-list">
              {FAQS.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button onClick={() => toggleFaq(index)} className="faq-trigger">
                    <span>{faq.question}</span>
                    {activeFaq === index ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ══════════════════════════════════ STYLES ══════════════════════════════════ */}
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-main {
          background-color: #0A0B10;
          color: #FFFFFF;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero-section {
          padding: 160px 0 100px;
          position: relative;
          overflow: hidden;
        }
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .hero-orb-1 {
          width: 600px; height: 600px;
          top: -200px; left: -100px;
          background: radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%);
        }
        .hero-orb-2 {
          width: 400px; height: 400px;
          top: 50%; right: -80px;
          background: radial-gradient(circle, rgba(210,242,58,0.08), transparent 70%);
        }
        .hero-orb-3 {
          width: 300px; height: 300px;
          bottom: -50px; left: 40%;
          background: radial-gradient(circle, rgba(234,161,251,0.1), transparent 70%);
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .hero-content { max-width: 650px; }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(184,155,255,0.1);
          border: 1px solid rgba(184,155,255,0.25);
          border-radius: 999px;
          color: #C3B5FD;
          font-weight: 700;
          font-size: 0.82rem;
          margin-bottom: 24px;
        }
        .hero-title {
          font-size: clamp(2.3rem, 5vw, 4rem);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: white;
          margin-bottom: 20px;
        }
        .text-highlight {
          background: linear-gradient(135deg, #B89BFF, #EAA1FB, #FE8FD9);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero-subtitle {
          color: #94A3B8;
          font-size: 1.15rem;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-metrics {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          flex-wrap: wrap;
        }
        .metric-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }
        .metric-chip-icon {
          width: 30px; height: 30px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .metric-chip-value {
          font-weight: 800;
          font-size: 1rem;
          color: white;
          line-height: 1;
        }
        .metric-chip-label {
          font-size: 0.7rem;
          color: #64748B;
          margin-top: 2px;
        }

        /* Dashboard Card */
        .dashboard-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.4);
          position: relative;
        }
        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .dash-eyebrow {
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #505466;
          margin-bottom: 6px;
        }
        .dash-value {
          font-size: 2.4rem;
          font-weight: 900;
          color: white;
          letter-spacing: -0.04em;
        }
        .dash-lima { color: #D2F23A; }
        .dash-badge-up {
          padding: 6px 14px;
          background: rgba(74,222,128,0.12);
          color: #4ade80;
          font-size: 0.78rem;
          font-weight: 700;
          border-radius: 999px;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .dash-chart-wrap { margin-bottom: 16px; }
        .dash-chart { width: 100%; height: 90px; }
        .dash-metrics {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 10px;
          margin-bottom: 16px;
        }
        .dash-metric-cell {
          background: rgba(255,255,255,0.03);
          border-radius: 14px;
          padding: 12px;
          text-align: center;
        }
        .dash-metric-lima { background: rgba(210,242,58,0.06); border: 1px solid rgba(210,242,58,0.12); }
        .dash-metric-lilac { background: rgba(184,155,255,0.06); border: 1px solid rgba(184,155,255,0.12); }
        .dash-metric-val { font-weight: 800; font-size: 1.1rem; color: white; }
        .dash-metric-label { font-size: 0.7rem; color: #64748B; margin-top: 2px; }
        .dash-bars { display: flex; flex-direction: column; gap: 8px; }
        .dash-bar-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .dash-bar-label { font-size: 0.72rem; color: #64748B; width: 100px; flex-shrink: 0; }
        .dash-bar-track {
          flex: 1;
          height: 5px;
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          overflow: hidden;
        }
        .dash-bar-fill { height: 100%; border-radius: 999px; }
        .dash-bar-pct { font-size: 0.72rem; color: #505466; width: 28px; text-align: right; }

        .float-chip {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #13141C;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          backdrop-filter: blur(20px);
        }
        .float-chip-top { top: -16px; right: -20px; }
        .float-chip-bottom { bottom: -16px; left: -20px; }
        .float-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse-dot 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-dot {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }
        .float-chip-title { font-weight: 700; font-size: 0.82rem; color: white; }
        .float-chip-sub { font-size: 0.7rem; color: #64748B; margin-top: 1px; }
        .hero-visual { position: relative; }

        /* ── BUTTONS ── */
        .btn-lima-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 32px;
          background: #D2F23A;
          color: #0A0B10;
          font-weight: 800;
          font-size: 0.95rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
        }
        .btn-lima-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(210,242,58,0.4);
          background: #E2F57D;
        }
        .btn-outline-dark {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.03);
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 100px;
          transition: all 0.3s;
          text-decoration: none;
        }
        .btn-outline-dark:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.3);
        }

        /* ── CLIENTS STRIP ── */
        .clients-strip {
          padding: 60px 0;
          background: #07080C;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .clients-title {
          text-align: center;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #828699;
          margin-bottom: 24px;
        }
        .clients-row {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 48px;
          flex-wrap: wrap;
        }
        .client-logo-card {
          font-weight: 700;
          color: #505466;
          font-size: 1.15rem;
          transition: color 0.3s;
          cursor: default;
        }
        .client-logo-card:hover { color: #D2F23A; }

        /* ── STATS BAR ── */
        .stats-bar {
          padding: 80px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 24px;
        }
        .stat-item { text-align: center; }
        .stat-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 12px;
        }
        .stat-value {
          font-size: clamp(2.5rem,5vw,3.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.85rem;
          color: #505466;
          font-weight: 600;
        }

        /* ── SERVICES ── */
        .services-section { padding: 120px 0; }
        .section-header { text-align: center; margin-bottom: 70px; }
        .section-tag {
          display: inline-flex;
          padding: 6px 16px;
          background: rgba(184,155,255,0.15);
          color: #B89BFF;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          border-radius: 99px;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: clamp(2rem,4.5vw,3rem);
          font-weight: 800;
          margin-bottom: 16px;
          color: white;
          letter-spacing: -0.04em;
        }
        .section-subtitle {
          color: #94A3B8;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 24px;
        }
        .service-card-v2 {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 28px;
          padding: 40px;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .service-card-v2::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: radial-gradient(circle at 0% 0%, rgba(210,242,58,0.06), transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .service-card-v2:hover::before { opacity: 1; }
        .service-card-v2:hover {
          transform: translateY(-8px);
          border-color: rgba(210,242,58,0.2);
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .svc-tag {
          display: inline-flex;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 20px;
        }
        .service-icon-wrapper {
          width: 56px; height: 56px;
          background: rgba(124,58,237,0.1);
          color: #C3B5FD;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s, background 0.3s;
        }
        .service-card-v2:hover .service-icon-wrapper {
          transform: scale(1.1) rotate(-4deg);
          background: rgba(210,242,58,0.12);
          color: #D2F23A;
        }
        .service-card-v2 h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 14px;
          color: white;
        }
        .service-card-v2 p {
          color: #94A3B8;
          font-size: 0.95rem;
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .svc-learn-more {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #505466;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          transition: color 0.3s, gap 0.3s;
        }
        .service-card-v2:hover .svc-learn-more {
          color: #D2F23A;
          gap: 10px;
        }

        /* ── CHANNELS ── */
        .channels-section {
          padding: 120px 0;
          background: #07080C;
          border-top: 1px solid rgba(255,255,255,0.04);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .channels-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .channels-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(210,242,58,0.1);
          border: 1px solid rgba(210,242,58,0.2);
          border-radius: 99px;
          color: #D2F23A;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 20px;
        }
        .channels-title {
          font-size: clamp(2rem,4vw,2.8rem);
          font-weight: 800;
          color: white;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 20px;
        }
        .channels-desc {
          color: #94A3B8;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .channels-list { list-style: none; display: flex; flex-direction: column; gap: 12px; padding: 0; }
        .channels-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #CBD5E1;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .channels-badges-wrap { position: relative; }
        .channels-badges-bg {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(210,242,58,0.04), rgba(184,155,255,0.03), transparent 70%);
          border-radius: 40px;
          pointer-events: none;
        }
        .channels-hint {
          text-align: center;
          font-size: 0.75rem;
          color: #505466;
          margin-top: 8px;
          font-style: italic;
        }

        /* ── RECOVER ── */
        .recover-section {
          padding: 120px 0;
          background: #0A0B10;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .recover-container {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 60px;
          align-items: center;
        }
        .section-tag-recover {
          display: inline-flex;
          padding: 6px 16px;
          background: rgba(210,242,58,0.1);
          color: #D2F23A;
          font-size: 0.78rem;
          font-weight: 800;
          text-transform: uppercase;
          border-radius: 99px;
          margin-bottom: 16px;
          border: 1px solid rgba(210,242,58,0.2);
        }
        .recover-title {
          font-size: clamp(2rem,4.5vw,3rem);
          font-weight: 800;
          color: white;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
        }
        .recover-subtitle {
          font-size: 1.25rem;
          font-weight: 700;
          color: #D2F23A;
          margin-bottom: 20px;
        }
        .recover-desc {
          color: #94A3B8;
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .recover-grid-visual {
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 16px;
        }
        .recover-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.3s;
        }
        .recover-card:hover {
          border-color: rgba(210,242,58,0.25);
          background: rgba(210,242,58,0.03);
          transform: translateY(-3px);
        }
        .recover-card-dot {
          width: 8px; height: 8px;
          background: #D2F23A;
          border-radius: 50%;
          margin-bottom: 16px;
          box-shadow: 0 0 10px #D2F23A;
        }
        .recover-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }
        .recover-card p {
          color: #64748B;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        /* ── TESTIMONIALS ── */
        .testimonials-section { padding: 120px 0; background: #07080C; }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 24px;
        }
        .testimonial-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 28px;
          padding: 36px;
          display: flex;
          flex-direction: column;
          transition: all 0.4s;
          position: relative;
          overflow: hidden;
        }
        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #D2F23A, transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .testimonial-card:hover::before { opacity: 1; }
        .testimonial-card:hover {
          border-color: rgba(255,255,255,0.1);
          transform: translateY(-6px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }
        .testimonial-stars { display: flex; gap: 3px; margin-bottom: 16px; }
        .testimonial-quote-icon { color: rgba(210,242,58,0.3); margin-bottom: 12px; }
        .testimonial-text {
          color: #94A3B8;
          font-size: 0.95rem;
          line-height: 1.75;
          flex: 1;
          margin-bottom: 24px;
        }
        .testimonial-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .testimonial-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg,#7C3AED,#6366F1);
          display: flex; align-items: center; justify-content: center;
          color: white;
          font-size: 0.8rem;
          font-weight: 800;
          flex-shrink: 0;
        }
        .testimonial-name { font-size: 0.9rem; font-weight: 700; color: white; }
        .testimonial-role { font-size: 0.75rem; color: #64748B; }
        .testimonial-metric { font-size: 0.9rem; font-weight: 800; }

        /* ── CONTACT ── */
        .contact-section { padding: 120px 0; }
        .contact-pretitle {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 64px;
        }
        .contact-pretitle-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          background: rgba(184,155,255,0.1);
          border: 1px solid rgba(184,155,255,0.2);
          border-radius: 99px;
          color: #B89BFF;
          font-size: 0.78rem;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .contact-pretitle-h2 {
          font-size: clamp(2rem,5vw,3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: white;
          line-height: 1.05;
          margin-bottom: 16px;
        }
        .contact-pretitle-sub {
          color: #94A3B8;
          font-size: 1.05rem;
          line-height: 1.6;
        }
        .contact-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          align-items: flex-start;
        }
        .contact-info { padding-top: 20px; }
        .benefit-list { display: grid; gap: 16px; margin-bottom: 32px; }
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #E2E8F0;
        }
        .benefit-icon { color: #D2F23A; flex-shrink: 0; }
        .contact-live-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: rgba(210,242,58,0.05);
          border: 1px solid rgba(210,242,58,0.15);
          border-radius: 18px;
          margin-top: 24px;
        }
        .contact-live-dot {
          width: 10px; height: 10px;
          background: #D2F23A;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        .contact-live-title { font-weight: 700; font-size: 0.9rem; color: white; }
        .contact-live-sub { font-size: 0.75rem; color: #64748B; }

        .form-card-container {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 32px;
          padding: 48px;
          backdrop-filter: blur(10px);
        }
        .form-steps-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          margin-bottom: 40px;
        }
        .form-steps-header::before {
          content: '';
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.05);
          z-index: 1;
        }
        .step-indicator {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: #1E293B;
          color: #94A3B8;
          border: 2px solid rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          z-index: 2;
          transition: all 0.3s;
        }
        .step-indicator.active {
          background: #835CE6;
          border-color: #B89BFF;
          color: white;
          box-shadow: 0 0 15px rgba(184,155,255,0.4);
        }
        .step-indicator.completed {
          background: #D2F23A;
          border-color: #D2F23A;
          color: #0A0B10;
        }
        .multistep-form h3 {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: white;
        }
        .options-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .option-btn {
          width: 100%;
          padding: 16px 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          color: #E2E8F0;
          text-align: left;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-size: 1rem;
        }
        .option-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(210,242,58,0.3);
          color: white;
        }
        .option-btn.selected {
          background: rgba(210,242,58,0.08);
          border-color: #D2F23A;
          color: white;
        }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #94A3B8;
        }
        .form-group input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px 20px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        .form-group input:focus {
          border-color: #D2F23A;
          box-shadow: 0 0 0 3px rgba(210,242,58,0.08);
        }
        .form-group input::placeholder { color: #3d4a5c; }
        .form-navigation {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
        }
        .btn-back {
          padding: 14px 28px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #94A3B8;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          font-size: 1rem;
        }
        .btn-back:hover { color: white; background: rgba(255,255,255,0.03); }
        .btn-next {
          padding: 14px 32px;
          background: #835CE6;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }
        .btn-next:hover { background: #6D3FE3; }
        .btn-submit-form {
          padding: 14px 32px;
          background: #D2F23A;
          border: none;
          border-radius: 12px;
          color: #0A0B10;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-size: 1rem;
        }
        .btn-submit-form:hover {
          background: #E2F57D;
          box-shadow: 0 0 20px rgba(210,242,58,0.3);
        }
        .status-banner {
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 24px;
          font-weight: 600;
          font-size: 0.92rem;
        }
        .status-banner.success {
          background: rgba(210,242,58,0.12);
          border: 1px solid rgba(210,242,58,0.3);
          color: #f0ffb0;
        }
        .status-banner.error {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fecaca;
        }

        /* ── FAQ ── */
        .faq-section {
          padding: 120px 0;
          background: #0A0B10;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .max-w-3xl { max-width: 800px; margin-left: auto; margin-right: auto; }
        .faq-list { display: grid; gap: 0; }
        .faq-item { border-bottom: 1px solid rgba(255,255,255,0.05); }
        .faq-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          text-align: left;
          color: #F1F5F9;
          font-size: 1.1rem;
          font-weight: 700;
          transition: color 0.2s;
          cursor: pointer;
          background: transparent;
          border: none;
          gap: 16px;
        }
        .faq-trigger:hover { color: #D2F23A; }
        .faq-answer {
          padding-bottom: 24px;
          color: #94A3B8;
          line-height: 1.65;
          font-size: 1rem;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2,1fr); }
          .services-grid { grid-template-columns: repeat(2,1fr); }
          .testimonials-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 900px) {
          .hero-container { grid-template-columns: 1fr; text-align: center; gap: 48px; }
          .hero-content { max-width: 100%; }
          .hero-badge { justify-content: center; display: inline-flex; }
          .hero-metrics { justify-content: center; }
          .hero-actions { justify-content: center; }
          .hero-visual { max-width: 500px; margin: 0 auto; }
          .float-chip-top { right: -8px; top: -8px; }
          .float-chip-bottom { left: -8px; bottom: -8px; }
          .channels-grid { grid-template-columns: 1fr; gap: 40px; }
          .recover-container { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .section-tag-recover { display: inline-flex; }
          .recover-grid-visual { max-width: 600px; margin: 0 auto; }
          .contact-wrapper { grid-template-columns: 1fr; gap: 48px; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2,1fr); gap: 16px; }
          .services-grid { grid-template-columns: 1fr; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .recover-grid-visual { grid-template-columns: 1fr; }
          .form-card-container { padding: 28px; }
          .hero-metrics { gap: 8px; }
          .metric-chip { padding: 8px 10px; }
          .float-chip { display: none; }
        }

        @keyframes animate-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-step { animation: animate-fade 0.3s ease; }

        /* Global container for landing sections */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
      `}} />
    </>
  );
}
