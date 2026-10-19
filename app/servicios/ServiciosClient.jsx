'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Target, BarChart3, Layers, ArrowRight, Clock,
  CheckCircle2, MessageCircle, Plus, Info,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { SERVICE_LINES, SETUP_FEE, ADDONS, COMING_SOON, CONDITIONS, planPriceLabel, priceLabel } from '@/lib/servicePlans.mjs';
import { waHref } from '@/lib/whatsapp';

// Los links de WhatsApp pasan por /wa para registrar el origen (ver lib/whatsapp.js).

const InstaIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Data: catálogo (octubre 2026). Precios y alcances: lib/servicePlans.mjs ─── */
const SERVICES = [
  {
    value: 'redes_sociales',
    icon: InstaIcon,
    tag: 'Contenido',
    color: '#EAA1FB',
    accent: 'rgba(234,161,251,0.12)',
    border: 'rgba(234,161,251,0.3)',
    priceLineId: 'social',
    title: 'NEXA Contenido',
    summary: 'Tus redes ordenadas y constantes, con piezas diseñadas con tu marca y un calendario que aprobás antes de que se publique.',
    includes: [
      'Calendario mensual aprobado en tu portal',
      'Piezas y historias diseñadas con tus colores, tipografía y logo',
      'Copys y hashtags listos para publicar',
      'Reels editados con tu material (planes Crecimiento y Marca)',
      'Informe mensual por escrito',
    ],
    how: 'Con lo que cargás en el formulario de inicio armamos tu línea editorial. Cada mes te llega el calendario al portal; lo aprobás o pedís cambios, y producimos las piezas. Cada entrega pasa una revisión de calidad antes de llegarte.',
    outcome: 'Presencia constante y profesional en tus redes, sin que tengas que pensar qué publicar cada semana.',
    idealFor: 'negocios que quieren delegar sus redes',
    timeframe: 'Primer calendario a los 7 días hábiles del formulario completo',
  },
  {
    value: 'meta_ads',
    icon: BarChart3,
    tag: 'Anuncios',
    color: '#FE8FD9',
    accent: 'rgba(254,143,217,0.14)',
    border: 'rgba(254,143,217,0.35)',
    priceLineId: 'ads',
    title: 'NEXA Anuncios',
    summary: 'Campañas en Instagram y Facebook para conseguir consultas y ventas, con la inversión bajo control y todo explicado por escrito.',
    includes: [
      'Configuración de píxel y eventos de conversión',
      'Propuesta de campaña con públicos y anuncios, aprobada en tu portal',
      'Anuncios nuevos todos los meses',
      'Optimización semanal',
      'Informe mensual por escrito',
    ],
    how: 'Te proponemos la campaña según tu plan de 90 días. Cuando la aprobás, la lanzamos desde tu cuenta publicitaria, la optimizamos cada semana y te contamos por escrito qué funcionó y qué cambiamos.',
    outcome: 'Consultas y ventas medibles, con un presupuesto que decidís vos. Los resultados dependen de tu mercado y tu oferta: no los garantizamos.',
    idealFor: 'negocios que quieren demanda constante',
    timeframe: 'Propuesta de campaña a los 7 días hábiles del formulario completo',
  },
  {
    value: 'nexa_integral',
    icon: Layers,
    tag: 'Integral',
    color: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.3)',
    priceLineId: 'integral',
    title: 'NEXA Integral',
    summary: 'Contenido, anuncios y estrategia trabajando juntos: el mismo mensaje en tus redes y en tus campañas, con un solo informe.',
    includes: [
      'Todo NEXA Contenido y NEXA Anuncios en un solo abono',
      'Calendario y campañas alineados al mismo plan',
      'Un solo informe mensual',
      'Ajuste trimestral del plan de 90 días',
      'Ahorro frente a contratar los servicios por separado',
    ],
    how: 'Un mismo plan de 90 días ordena el contenido y las campañas. Lo que funciona en los anuncios alimenta el contenido, y al revés. Aprobás todo desde un solo portal.',
    outcome: 'Una marca coherente en todos sus canales y un único lugar para ver qué se hizo y qué sigue.',
    idealFor: 'negocios que quieren delegar todo su marketing digital',
    timeframe: 'Plan y primeras entregas a los 7 días hábiles del formulario completo',
  },
  {
    value: 'orden_digital',
    icon: Target,
    tag: 'Proyecto',
    color: '#835CE6',
    accent: 'rgba(131,92,230,0.12)',
    border: 'rgba(131,92,230,0.3)',
    priceLineId: 'proyectos',
    title: 'Diagnóstico y Orden Digital',
    summary: 'Una auditoría completa de cómo se ve tu marca online, con un plan de 90 días y una lista de mejoras lista para aplicar. Pago único, sin abono.',
    includes: [
      'Diagnóstico de marca, competencia y público',
      'Plan de 90 días y propuesta de valor',
      'Auditoría de tu web, Google Business y hasta 3 redes',
      'Lista de mejoras ordenada por prioridad',
      'Textos de perfiles y biografías corregidos',
    ],
    how: 'Completás el formulario guiado y nos das acceso de lectura a tus perfiles. Revisamos todo lo que un cliente ve de tu marca y te entregamos el informe en tu portal.',
    outcome: 'Saber exactamente qué arreglar primero y tener los textos listos para hacerlo.',
    idealFor: 'marcas con presencia digital desordenada o desactualizada',
    timeframe: 'Entrega en 10 días hábiles',
  },
];

/*
 * Los precios y los planes YA NO viven acá. Están en lib/servicePlans.mjs, que
 * es la única fuente: la misma que usa el servidor para saber cuánto cobrar.
 * Así lo que se muestra en pantalla y lo que se cobra no se pueden
 * desincronizar, y el monto ya no viaja en la URL del checkout.
 */
const PRICING_LINES = SERVICE_LINES;

/*
 * NOTA (septiembre 2026): se eliminaron de esta página TESTIMONIALS (tres
 * testimonios firmados por Martina González / Boutique Aurea, Carlos Ruiz /
 * TechFlow Solutions y Valentina Méndez / Estudio Vivo) y TRUST_CHIPS
 * (+20 marcas asesoradas, 3x ROI promedio, +6 años de experiencia), porque
 * eran datos inventados: NEXA todavía no tiene clientes ni resultados que los
 * respalden. No reponer sin datos reales y verificables.
 */

const STEPS = [
  { num: '01', title: 'Formulario guiado', desc: 'Nos contás tu marca una sola vez: colores, tipografía, logo, referencias y objetivos. Nadie te va a pedir lo mismo dos veces.', output: 'En lugar de una reunión de arranque.' },
  { num: '02', title: 'Plan aprobado', desc: 'Te entregamos el diagnóstico y el plan de 90 días en tu portal. Lo aprobás o pedís cambios con un clic.', output: 'Entregable: plan de 90 días por escrito.' },
  { num: '03', title: 'Entregas con revisión', desc: 'Calendarios, piezas y campañas pasan una revisión de calidad antes de llegarte. Nada se publica sin tu OK.', output: 'Entregable: piezas y campañas aprobadas.' },
  { num: '04', title: 'Informe mensual', desc: 'Cada mes recibís por escrito qué se hizo, qué funcionó, qué sigue y qué necesitamos de vos.', output: 'Entregable: informe mensual en tu portal.' },
];

const FAQS = [
  {
    q: '¿Cómo arranco a trabajar con NEXA?',
    a: 'Elegís el plan y pagás con Mercado Pago o transferencia. Te llega por mail el formulario guiado para cargar tu marca; con eso arrancamos y en 7 días hábiles tenés tu plan de 90 días en el portal.',
  },
  {
    q: '¿Hacen reuniones?',
    a: 'No hacemos reuniones periódicas. Todo queda por escrito en tu portal: aprobás cada entrega, seguís el avance y recibís un informe mensual. Si en algún momento querés hablar, podés sumar una sesión estratégica por videollamada de 45 minutos.',
  },
  {
    q: '¿Qué es la Puesta en marcha?',
    a: `Es el trabajo inicial de cualquier abono: diagnóstico, plan de 90 días, guía visual básica y alta en tu portal. Se paga una sola vez (${priceLabel(SETUP_FEE.amount)}) junto con el primer mes. Desde el segundo mes pagás solo el abono.`,
  },
  {
    q: '¿La publicidad está incluida?',
    a: 'No. Nuestros precios son honorarios de gestión. La inversión en publicidad la pagás vos directo a Meta, con tu tarjeta, y decidís cuánto invertir.',
  },
  {
    q: '¿Hay permanencia mínima?',
    a: 'Sí, 3 meses en los abonos: es el tiempo mínimo para que el plan de 90 días dé resultados. Después seguís mes a mes y podés darlo de baja con 15 días de aviso.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Tarjeta de crédito o débito por Mercado Pago, y transferencia bancaria con 10% de descuento. Antes de cada vencimiento te mandamos el link de pago por mail.',
  },
  {
    q: '¿Cuánto tardan en responder?',
    a: 'Respondemos consultas en 1 día hábil y aplicamos cambios en 2 días hábiles. Cada pieza y cada calendario incluyen 1 ronda de cambios.',
  },
];

/* "Desde $199.900/mes": el plan más barato de la línea, leído de servicePlans. */
function precioDesde(lineId) {
  const line = SERVICE_LINES.find((l) => l.id === lineId);
  if (!line) return '';
  const min = line.tiers.reduce((a, b) => (b.amount < a.amount ? b : a));
  return `${planPriceLabel(min)}${line.billingType === 'mensual' ? '/mes' : ''}`;
}

const SERVICE_TO_LINE = SERVICES.reduce((acc, s) => {
  acc[s.value] = s.priceLineId;
  return acc;
}, {});

function ServiciosContent() {
  const searchParams = useSearchParams();
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeLine, setActiveLine] = useState(PRICING_LINES[0].id);

  const goToPlans = (id) => {
    setActiveLine(id);
    document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Si llega desde un CTA de Home con ?servicio=slug, preseleccionamos el plan correspondiente
  useEffect(() => {
    const servicio = searchParams.get('servicio');
    const line = servicio && SERVICE_TO_LINE[servicio];
    if (line) {
      setActiveLine(line);
      setTimeout(() => {
        document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [searchParams]);

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <main style={{ paddingTop: 'clamp(100px, 12vw, 140px)' }}>

        {/* ══════ HERO ══════ */}
        <section style={{ paddingBottom: 8 }}>
          <motion.div className="container" style={{ textAlign: 'center', marginBottom: 40 }} initial="hidden" animate="show" variants={stagger}>
            <motion.span variants={fadeUp} className="section-tag">Áreas de expertise</motion.span>
            <motion.h1 variants={fadeUp} className="section-title">Qué hacemos por tu <span className="text-gradient">negocio.</span></motion.h1>
            <motion.p variants={fadeUp} className="section-subtitle" style={{ margin: '0 auto 28px' }}>
              Contenido, anuncios y estrategia con alcance claro, precio público y todo el seguimiento por escrito en tu portal. Sin reuniones que coordinar.
            </motion.p>
            {/* Se eliminaron los chips de "confianza" (+20 marcas asesoradas,
                3x ROI promedio, +6 años de experiencia): datos inventados. */}
          </motion.div>
        </section>

        {/* Banner */}
        <section style={{ padding: '24px 0 56px' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', height: 'clamp(220px, 32vw, 360px)', maxWidth: 980, margin: '0 auto', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 70px rgba(13,14,21,0.14)' }}>
              <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80" alt="Equipo de NEXA planificando estrategia con datos" fill sizes="(max-width: 980px) 100vw, 980px" style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', left: 24, bottom: 24, background: '#fff', padding: '13px 22px', borderRadius: 100, fontSize: '0.86rem', fontWeight: 700, color: '#12141D', boxShadow: '0 14px 32px rgba(13,14,21,0.18)' }}>Estrategia + datos en un mismo equipo</div>
            </motion.div>
          </div>
        </section>

        {/* ══════ SERVICES CATALOG ══════ */}
        <section style={{ padding: '0 0 90px' }}>
          <div className="container">
            <motion.div className="section-header" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.span variants={fadeUp} className="section-tag">Catálogo de servicios</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Elegí el servicio que necesitás</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle" style={{ margin: '0 auto' }}>
                Cada servicio detalla qué vas a recibir, cómo trabajamos y qué resultado podés esperar, para que evalúes y avances sin intermediarios.
              </motion.p>
            </motion.div>

            <motion.div className="svc-catalog-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
              {SERVICES.map((s) => {
                const waText = `Hola NEXA! Quiero contratar el servicio de ${s.title}. ¿Me contás cuál es el siguiente paso?`;
                return (
                  <motion.article key={s.value} variants={scaleIn} className="svc-card" whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                    <div className="svc-card-head">
                      <div className="svc-icon" style={{ background: s.accent, border: `1px solid ${s.border}`, color: s.color }}>
                        <s.icon size={24} />
                      </div>
                      <span className="svc-tag-pill" style={{ color: s.color, background: s.accent, border: `1px solid ${s.border}` }}>{s.tag}</span>
                    </div>

                    <div>
                      <h3>{s.title}</h3>
                      <p className="svc-summary">{s.summary}</p>
                    </div>

                    <div>
                      <div className="svc-block-title">Qué incluye</div>
                      <ul className="svc-includes">
                        {s.includes.map((item) => (
                          <li key={item}>
                            <CheckCircle2 size={15} style={{ color: s.color }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="svc-two-col">
                      <div>
                        <h5>Cómo funciona</h5>
                        <p>{s.how}</p>
                      </div>
                      <div>
                        <h5>Resultado esperado</h5>
                        <p>{s.outcome}</p>
                      </div>
                    </div>

                    <div className="svc-meta-row">
                      <span className="svc-meta-chip">Ideal para {s.idealFor}</span>
                      <span className="svc-meta-chip">{s.timeframe}</span>
                    </div>

                    <div className="svc-footer">
                      <div className="svc-price">
                        <span className="svc-price-label">Desde</span>
                        <span className="svc-price-value" style={{ color: s.color }}>{precioDesde(s.priceLineId)}</span>
                      </div>
                      <div className="svc-cta-row">
                        <button type="button" onClick={() => goToPlans(s.priceLineId)} className="btn btn-lima btn-sm">
                          Quiero este servicio <ArrowRight size={15} />
                        </button>
                        <a href={waHref('servicio_card', waText)} target="_blank" rel="noopener noreferrer" className="btn-wa">
                          <MessageCircle size={15} /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>

            <motion.div className="pricing-note" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div>
                <h4>Precios públicos y alcances cerrados</h4>
                <p>Cada plan dice qué incluye y qué no. Los abonos arrancan con la Puesta en marcha ({priceLabel(SETUP_FEE.amount)}, única vez).</p>
              </div>
              <button type="button" onClick={() => goToPlans('social')} className="btn btn-primary btn-sm">
                Ver planes y precios <ArrowRight size={15} />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ══════ PRICING ══════ */}
        <section id="planes" style={{ padding: 'clamp(64px, 8vw, 100px) 0', background: 'var(--bg-soft)' }}>
          <div className="container">
            <motion.div className="section-header" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.span variants={fadeUp} className="section-tag">Precios transparentes</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Planes y precios</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle" style={{ margin: '0 auto' }}>
                Elegí el servicio y el plan que más se ajuste a tu etapa. Cada plan dice qué incluye y qué no.
              </motion.p>
            </motion.div>

            <div className="pricing-tabs" role="tablist">
              {PRICING_LINES.map((line) => (
                <button
                  key={line.id}
                  type="button"
                  role="tab"
                  aria-selected={activeLine === line.id}
                  className={`pricing-tab ${activeLine === line.id ? 'active' : ''}`}
                  style={activeLine === line.id ? { color: line.color, borderColor: line.border, background: line.accent } : undefined}
                  onClick={() => setActiveLine(line.id)}
                >
                  {line.label}
                </button>
              ))}
            </div>

            {(() => {
              const line = PRICING_LINES.find((l) => l.id === activeLine) || PRICING_LINES[0];
              return (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="pricing-line-tagline">
                    <span style={{ color: line.color, fontWeight: 800 }}>{line.billing}</span> — {line.tagline}
                  </p>

                  <p className="pricing-fees-notice">
                    <Info size={15} />
                    <span>
                      Los precios son <strong>honorarios de gestión</strong> y no incluyen IVA.
                      La <strong>inversión en publicidad va aparte</strong> y la pagás vos, directo a Meta.
                      {line.billingType === 'mensual' && (
                        <> El primer mes suma la <strong>Puesta en marcha ({priceLabel(SETUP_FEE.amount)}, única vez)</strong>.</>
                      )}
                    </span>
                  </p>

                  <div className="pricing-grid">
                    {line.tiers.map((tier) => {
                      const priceText = planPriceLabel(tier);
                      const planPriceText = tier.suffix === 'pago único' ? `${priceText}, pago único` : `${priceText}${tier.suffix}`;
                      const lineTitle = `NEXA ${line.shortLabel}`;
                      /*
                       * El link del checkout lleva SOLO el identificador del plan.
                       * Ya no viaja el monto: el servidor lo busca en
                       * lib/servicePlans.mjs. Así, editar la URL no cambia el
                       * precio que se cobra.
                       */
                      const checkoutHref = `/servicios/checkout?plan=${encodeURIComponent(tier.id)}`;
                      const waPlanText = `Hola NEXA! Quiero contratar el plan ${tier.name} de NEXA ${line.shortLabel} (${planPriceText}). ¿Cómo seguimos?`;
                      return (
                        <div
                          key={tier.name}
                          className={`pricing-card ${tier.badge ? 'featured' : ''}`}
                          style={tier.badge ? { borderColor: line.border, background: line.accent } : undefined}
                        >
                          {tier.badge && (
                            <div className="pricing-card-ribbon" style={{ background: line.color }}>Más elegido</div>
                          )}
                          <div className="pricing-card-name">{tier.name}</div>
                          <div className="pricing-card-price">
                            {priceText}
                            <span>{tier.suffix === 'pago único' ? 'pago único' : tier.suffix}</span>
                          </div>
                          {tier.separateAmount && (
                            <div className="pricing-card-includes" style={{ color: line.color }}>
                              Por separado: {priceLabel(tier.separateAmount)}/mes. Ahorrás {priceLabel(tier.separateAmount - tier.amount)}.
                            </div>
                          )}
                          {tier.includesPrevious && (
                            <div className="pricing-card-includes" style={{ color: line.color }}>Todo lo de {tier.includesPrevious}, más:</div>
                          )}
                          <ul className="pricing-card-features">
                            {tier.features.map((f) => (
                              <li key={f}>
                                <CheckCircle2 size={14} style={{ color: line.color }} />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="pricing-card-cta">
                            <Link href={checkoutHref} className="btn btn-lima btn-sm" style={{ justifyContent: 'center' }}>
                              Quiero el plan {tier.name}
                            </Link>
                            <a href={waHref('plan_card', waPlanText)} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ justifyContent: 'center' }}>
                              <MessageCircle size={14} /> WhatsApp
                            </a>
                            <Link href={`/contacto?servicio=${line.slug}&plan=${encodeURIComponent(`${tier.name} — ${lineTitle} (${planPriceText})`)}`} style={{ textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              ¿Dudas? Escribinos
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {line.notIncludedLine && <p className="pricing-footnote">{line.notIncludedLine}</p>}
                  {line.footnote && <p className="pricing-footnote">{line.footnote}</p>}
                </motion.div>
              );
            })()}
          </div>
        </section>

        {/* ══════ PUESTA EN MARCHA · ADICIONALES · CONDICIONES · PRÓXIMAMENTE ══════ */}
        <section style={{ padding: 'clamp(56px, 7vw, 88px) 0' }}>
          <div className="container" style={{ maxWidth: 1080 }}>
            <div className="svc-extra-grid">
              <div className="svc-extra-card">
                <span className="svc-extra-tag">Única vez · {priceLabel(SETUP_FEE.amount)}</span>
                <h3>{SETUP_FEE.name}</h3>
                <p className="svc-extra-sub">El arranque de cualquier abono. Se paga junto con el primer mes.</p>
                <ul className="svc-includes">
                  {SETUP_FEE.features.map((f) => (
                    <li key={f}><CheckCircle2 size={15} style={{ color: '#835CE6' }} /><span>{f}</span></li>
                  ))}
                </ul>
                <p className="svc-extra-note">{SETUP_FEE.note}</p>
              </div>

              <div className="svc-extra-card">
                <span className="svc-extra-tag">Se suman a cualquier plan</span>
                <h3>Adicionales</h3>
                <ul className="svc-extra-list">
                  {ADDONS.map((a) => (
                    <li key={a.name}><span>{a.name}</span><strong>{priceLabel(a.amount)}{a.suffix || ''}</strong></li>
                  ))}
                </ul>
                <a href={waHref('servicios_adicionales', 'Hola NEXA! Quiero sumar un adicional a mi plan.')} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ marginTop: 14 }}>
                  <MessageCircle size={15} /> Pedir un adicional
                </a>
              </div>

              <div className="svc-extra-card">
                <span className="svc-extra-tag">Para todos los servicios</span>
                <h3>Cómo trabajamos</h3>
                <ul className="svc-includes">
                  {CONDITIONS.map((c) => (
                    <li key={c}><Clock size={15} style={{ color: '#835CE6' }} /><span>{c}</span></li>
                  ))}
                </ul>
              </div>

              <div className="svc-extra-card">
                <span className="svc-extra-tag">Próximamente</span>
                <h3>En desarrollo</h3>
                <p className="svc-extra-sub">Todavía no los vendemos. Si te interesan, avisanos y te escribimos cuando estén listos.</p>
                <ul className="svc-extra-list">
                  {COMING_SOON.map((c) => (
                    <li key={c.id}><span><strong>{c.name}</strong> — {c.desc}</span></li>
                  ))}
                </ul>
                <Link href="/contacto?servicio=proximamente" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
                  Quiero que me avisen <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
          <style jsx>{`
            .svc-extra-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
            .svc-extra-card { background: #fff; border: 1px solid rgba(13,14,21,0.08); border-radius: 22px; padding: 26px; display: flex; flex-direction: column; gap: 10px; }
            .svc-extra-card h3 { font-size: 1.25rem; font-weight: 800; margin: 0; }
            .svc-extra-tag { align-self: flex-start; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; color: #835CE6; background: rgba(131,92,230,0.1); border-radius: 100px; padding: 5px 12px; }
            .svc-extra-sub, .svc-extra-note { font-size: 0.86rem; color: var(--text-muted); margin: 0; }
            .svc-extra-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem; }
            .svc-extra-list li { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dashed rgba(13,14,21,0.08); padding-bottom: 8px; }
            .svc-extra-list strong { white-space: nowrap; }
            @media (max-width: 760px) { .svc-extra-grid { grid-template-columns: 1fr; } }
          `}</style>
        </section>

        {/* Se eliminó la sección de testimonios ("Lo que dicen nuestros
            clientes" + "Más de 20 empresas ya escalaron su negocio
            contratando estos mismos servicios" + tres testimonios firmados).
            Todo inventado. */}

        {/* ══════ Methodology ══════ */}
        <section className="methodology">
          <div className="container">
            <motion.div className="section-header" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.span variants={fadeUp} className="section-tag" style={{ background: 'rgba(210,242,58,0.14)', color: '#5c6608', border: '1px solid rgba(210,242,58,0.3)' }}>Nuestro proceso</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">El método NEXA</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle" style={{ margin: '0 auto' }}>Un framework claro, aplicado a cualquier servicio que elijas, para construir marcas sostenibles y escalables.</motion.p>
            </motion.div>
            <motion.div className="method-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
              {STEPS.map((step) => (
                <motion.div key={step.num} variants={fadeUp} className="method-step" whileHover={{ y: -6 }}>
                  <div className="method-number">{step.num}</div>
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                  <p style={{ color: '#5c6608', fontSize: '0.78rem', fontWeight: 700, marginTop: 14 }}>{step.output}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════ FAQ ══════ */}
        <section className="section" style={{ paddingTop: 88, paddingBottom: 88 }}>
          <div className="container" style={{ maxWidth: 820, margin: '0 auto' }}>
            <motion.div className="section-header" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <motion.span variants={fadeUp} className="section-tag">Dudas frecuentes</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">Antes de escribirnos</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle" style={{ margin: '0 auto' }}>Si todavía tenés dudas sobre cómo contratar un servicio, estas son las respuestas más comunes.</motion.p>
            </motion.div>

            <motion.div className="svc-faq-list" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {FAQS.map((faq, index) => (
                <motion.div key={faq.q} variants={fadeUp} className="svc-faq-item">
                  <motion.button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="svc-faq-trigger"
                    whileHover={{ x: 2 }}
                  >
                    <span>{faq.q}</span>
                    <motion.div animate={{ rotate: activeFaq === index ? 45 : 0 }} transition={{ duration: 0.25 }} className="svc-faq-icon">
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
                        <div className="svc-faq-answer">
                          <p>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══════ CTA ══════ */}
        <section style={{ background: '#0D0E15', padding: 'clamp(64px, 10vw, 100px) 0' }}>
          <motion.div className="container" style={{ textAlign: 'center' }} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="section-title text-white" style={{ marginBottom: 12 }}>¿Listo para avanzar?</h2>
            <p className="section-subtitle text-white-50" style={{ margin: '0 auto 32px' }}>
              Elegí un plan o escribinos. Respondemos en 1 día hábil.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contacto" className="btn btn-lima" style={{ fontSize: '1rem' }}>
                Quiero potenciar mi negocio <ArrowRight size={18} />
              </Link>
              <a href={waHref('servicios_cta')} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ fontSize: '0.95rem', padding: '16px 30px' }}>
                <MessageCircle size={18} /> Hablar por WhatsApp
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function ServiciosClient() {
  return (
    <Suspense fallback={null}>
      <ServiciosContent />
    </Suspense>
  );
}
