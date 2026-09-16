'use client';
import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Target, BarChart3, Users, Layers, RefreshCw, ArrowRight,
  CheckCircle2, MessageCircle, Plus, Info,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { SERVICE_LINES, planPriceLabel } from '@/lib/servicePlans.mjs';

const WHATSAPP_NUMBER = '5491124527402';

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

/* ─── Data: catálogo detallado (orden = recorrido del cliente: estrategia → fundamentos → contenido → performance → retención → sistemas) ─── */
const SERVICES = [
  {
    value: 'marketing_integral',
    icon: BarChart3,
    tag: 'Estrategia',
    color: '#B89BFF',
    accent: 'rgba(184,155,255,0.12)',
    border: 'rgba(184,155,255,0.3)',
    priceLineId: 'marketing',
    priceFrom: '$149.900/mes',
    title: 'Marketing & Estrategia',
    summary: 'Un plan de marketing accionable, basado en el diagnóstico real de tu marca y tu mercado, para posicionarte y dominar tu nicho.',
    includes: [
      'Diagnóstico de marca, competencia y audiencia',
      'Plan de marketing a 90 días con objetivos medibles',
      'Definición de propuesta de valor y mensajes clave',
      'Calendario de acciones por canal (orgánico + pago)',
      'Reunión mensual de revisión de resultados',
    ],
    how: 'Analizamos tu situación actual, tu competencia y tu público objetivo. Con esa información diseñamos una hoja de ruta clara, con metas concretas por trimestre, que ejecutamos y ajustamos según los datos reales.',
    outcome: 'Una estrategia clara y accionable, con foco en posicionamiento de marca y ventas medibles dentro de los primeros 90 días.',
    idealFor: 'marcas en crecimiento sin dirección clara',
    timeframe: 'Primeros entregables en 2-3 semanas',
  },
  {
    value: 'orden_digital',
    icon: Layers,
    tag: 'Fundamentos',
    color: '#FE8FD9',
    accent: 'rgba(254,143,217,0.14)',
    border: 'rgba(254,143,217,0.35)',
    priceLineId: 'web',
    priceFrom: '$99.000',
    title: 'Orden Digital y Estructura',
    summary: 'Auditoría, diseño y organización profunda de tu marca en todos los puntos de contacto digital.',
    includes: [
      'Auditoría completa de presencia digital (web, redes, Google Business)',
      'Rediseño de identidad visual y manual de marca básico',
      'Optimización de perfiles, biografías y enlaces',
      'Estructuración de Google Business / Maps',
      'Landing page nueva o mejora del sitio existente',
    ],
    how: 'Revisamos todo lo que un cliente ve de tu marca online, detectamos inconsistencias y lo unificamos bajo una imagen profesional y coherente en cada canal.',
    outcome: 'Una marca percibida como más confiable y profesional, con mejor primera impresión y mayor conversión de visitas a consultas.',
    idealFor: 'marcas con presencia digital desprolija o desactualizada',
    timeframe: 'Diagnóstico y plan de orden en 1 semana',
  },
  {
    value: 'redes_sociales',
    icon: InstaIcon,
    tag: 'Contenido',
    color: '#EAA1FB',
    accent: 'rgba(234,161,251,0.12)',
    border: 'rgba(234,161,251,0.3)',
    priceLineId: 'social',
    priceFrom: '$119.900/mes',
    title: 'Redes Sociales y Contenido',
    summary: 'Gestión profesional y diseño premium de tu presencia digital en Instagram, TikTok y más, sin que pierdas calidad ni consistencia.',
    includes: [
      'Calendario de contenido mensual (reels, posts, historias)',
      'Diseño gráfico y edición de video profesional',
      'Redacción de copys y guion de reels',
      'Community management: respuesta a comentarios y DMs',
      'Reporte mensual de alcance, interacciones y crecimiento',
    ],
    how: 'Definimos la línea editorial acorde a tu marca, producimos el contenido mes a mes y publicamos según calendario, optimizando el formato y el horario según lo que mejor performa.',
    outcome: 'Presencia digital consistente, crecimiento sostenido de seguidores y engagement, y una marca percibida como más profesional.',
    idealFor: 'negocios que quieren delegar sus redes',
    timeframe: 'Primer contenido publicado en la semana 1',
  },
  {
    value: 'meta_ads',
    icon: Target,
    tag: 'Performance',
    color: '#D2F23A',
    accent: 'rgba(210,242,58,0.12)',
    border: 'rgba(210,242,58,0.3)',
    priceLineId: 'ads',
    priceFrom: '$149.900/mes',
    title: 'Campañas y Captación',
    summary: 'Gestión avanzada de publicidad paga en Meta Ads y Google Ads, enfocada exclusivamente en retorno de inversión y escala.',
    includes: [
      'Configuración de cuentas, píxeles y conversiones',
      'Segmentación de audiencias y armado de campañas',
      'Diseño de creativos publicitarios (imagen y video)',
      'Optimización semanal de presupuesto y pujas',
      'Dashboard de resultados en tiempo real (leads, CPL, ROAS)',
    ],
    how: 'Configuramos el tracking, lanzamos campañas de testeo, identificamos los anuncios y audiencias ganadoras y escalamos presupuesto hacia lo que mejor convierte.',
    outcome: 'Leads y ventas medibles, con costo de adquisición controlado desde el primer mes de campaña.',
    idealFor: 'negocios que buscan demanda constante y previsible',
    timeframe: 'Campañas activas en 5-7 días hábiles',
  },
  {
    value: 'nexa_recover',
    icon: RefreshCw,
    tag: 'Premium Feature',
    color: '#D2F23A',
    accent: 'rgba(210,242,58,0.12)',
    border: 'rgba(210,242,58,0.3)',
    priceLineId: 'recover',
    priceFrom: '$149.900/mes',
    title: 'NEXA Recover',
    summary: 'Estrategias de customer experience y reactivación de clientes inactivos, leads perdidos y ventas que quedaron en el camino.',
    includes: [
      'Segmentación de tu base de datos (inactivos, leads fríos, ventas perdidas)',
      'Secuencias automatizadas de reactivación por WhatsApp y Email',
      'Ofertas y guiones de recontacto personalizados',
      'Bots comerciales inteligentes de primer contacto',
      'Reporte de oportunidades recuperadas',
    ],
    how: 'Analizamos tu base de datos existente, la segmentamos por potencial de recompra y activamos secuencias automáticas para reabrir la conversación comercial.',
    outcome: 'Facturación adicional sin invertir en nueva pauta publicitaria, aprovechando contactos que ya conocen tu marca.',
    idealFor: 'negocios con base de clientes o leads acumulada sin explotar',
    timeframe: 'Primeras reactivaciones dentro de los 30 días',
  },
  {
    value: 'crm_seguimiento',
    icon: Users,
    tag: 'Tecnología',
    color: '#835CE6',
    accent: 'rgba(131,92,230,0.12)',
    border: 'rgba(131,92,230,0.3)',
    priceLineId: 'crm',
    priceFrom: '$149.900/mes',
    title: 'CRM y Seguimiento',
    summary: 'Sistemas inteligentes para organizar el seguimiento comercial, para que ningún lead se pierda entre chats y planillas.',
    includes: [
      'Implementación de CRM (NEXA OS o el que ya uses)',
      'Automatización de seguimiento por WhatsApp y Email',
      'Embudos de venta configurados por etapa',
      'Capacitación del equipo comercial',
      'Alertas automáticas de leads sin seguimiento',
    ],
    how: 'Mapeamos tu proceso de ventas actual, lo digitalizamos en el CRM y automatizamos los recordatorios y mensajes para que ningún lead se enfríe por falta de respuesta.',
    outcome: 'Mayor tasa de conversión de leads a clientes y visibilidad total del embudo comercial en un solo lugar.',
    idealFor: 'equipos que hoy gestionan leads por WhatsApp o planillas',
    timeframe: 'CRM operativo en 1-2 semanas',
  },
];

/* ─── Data: líneas de producto con precio fijo ───
   Marketing & Estrategia y CRM y Seguimiento comparten estructura de precios
   con las líneas más afines conceptualmente (Ads y Recover respectivamente),
   con beneficios redactados para su propio alcance. ─── */
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
  { num: '01', title: 'Diagnóstico Estratégico', desc: 'Analizamos el estado actual de tu marca, tu competencia y tus canales activos.', output: 'Entregable: informe con oportunidades priorizadas.' },
  { num: '02', title: 'Diseño del Plan', desc: 'Trazamos la hoja de ruta, el servicio (o combinación) más adecuado y las metas por trimestre.', output: 'Entregable: plan de acción con cronograma y objetivos.' },
  { num: '03', title: 'Ejecución y Despliegue', desc: 'Implementamos campañas, contenido, CRM o automatizaciones según el servicio contratado.', output: 'Entregable: canales y sistemas activos, funcionando.' },
  { num: '04', title: 'Medición y Optimización', desc: 'Monitoreamos resultados día a día y ajustamos la estrategia con datos reales, no supuestos.', output: 'Entregable: reporte periódico de resultados.' },
];

const FAQS = [
  {
    q: '¿Cómo arranco a trabajar con NEXA?',
    a: 'Elegís el plan que más se ajusta a lo que necesitás y pagás directo con Mercado Pago o transferencia bancaria. Si todavía tenés dudas, también podés pedir un diagnóstico gratis sin compromiso antes de pagar, o escribirnos por WhatsApp.',
  },
  {
    q: '¿Necesito agendar una llamada antes de contratar?',
    a: 'No es un requisito. Toda la información de qué incluye cada servicio, cómo trabajamos y qué resultado podés esperar está en esta página. Si con eso te alcanza, podés avanzar directo desde el formulario.',
  },
  {
    q: '¿Cómo se define la inversión de cada servicio?',
    a: 'Los seis servicios tienen planes con precio fijo y público, sin cotizaciones a medida: los ves completos en la sección "Planes y precios" de esta página, cada uno con 3 niveles (Start, Growth y Scale) según el alcance que necesites.',
  },
  {
    q: '¿Los planes son mensuales?',
    a: 'NEXA Recover, NEXA Social y NEXA Ads se facturan mensualmente, mes a mes. NEXA Web es distinto: es un pago único, pagás una vez y el sitio queda terminado y es tuyo.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Aceptamos tarjeta de crédito y débito a través de Mercado Pago, y transferencia bancaria. Pagando por transferencia tenés un 10% de descuento automático en cualquier plan. En los planes mensuales, el primer pago corresponde al mes 1; la renovación de los meses siguientes se coordina directamente con vos.',
  },
  {
    q: '¿Puedo combinar más de un servicio?',
    a: 'Sí. Muchos clientes combinan Social + Ads + Recover para cubrir todo el embudo. Podés arrancar por el que más te urge ahora y sumar otros más adelante.',
  },
];

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
              Seis soluciones pensadas para posicionar tu marca, ordenar el seguimiento comercial y facturar más — con el detalle necesario para que decidas sin necesitar una llamada previa.
            </motion.p>
            {/* Se eliminaron los chips de "confianza" (+20 marcas asesoradas,
                3x ROI promedio, +6 años de experiencia): datos inventados. */}
          </motion.div>
        </section>

        {/* Banner */}
        <section style={{ padding: '24px 0 56px' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', maxWidth: 980, margin: '0 auto', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 70px rgba(13,14,21,0.14)' }}>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&q=80" alt="Equipo de NEXA planificando estrategia con datos" loading="lazy" style={{ width: '100%', height: 'clamp(220px, 32vw, 360px)', objectFit: 'cover', display: 'block' }} />
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
                const waText = encodeURIComponent(`Hola NEXA! Quiero contratar el servicio de ${s.title}. ¿Me contás cuál es el siguiente paso?`);
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
                        <span className="svc-price-value" style={{ color: s.color }}>{s.priceFrom}</span>
                      </div>
                      <div className="svc-cta-row">
                        <button type="button" onClick={() => goToPlans(s.priceLineId)} className="btn btn-lima btn-sm">
                          Quiero este servicio <ArrowRight size={15} />
                        </button>
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="btn-wa">
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
                <h4>Los 6 servicios tienen precio fijo y público</h4>
                <p>Sin cotizaciones a medida: mirá los planes completos de cada servicio más abajo, con 3 niveles para elegir según el alcance que necesites.</p>
              </div>
              <button type="button" onClick={() => goToPlans('marketing')} className="btn btn-primary btn-sm">
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
                Elegí la línea de producto y el plan que más se ajuste a tu etapa. Sin letra chica.
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
                      Los precios son <strong>honorarios de gestión</strong>: cubren nuestro trabajo.
                      La <strong>inversión publicitaria en Meta y Google va aparte</strong> y la pagás vos,
                      directamente a cada plataforma.
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
                      const waPlanText = encodeURIComponent(`Hola NEXA! Quiero contratar el plan ${tier.name} de NEXA ${line.shortLabel} (${planPriceText}). ¿Cómo seguimos?`);
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
                            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waPlanText}`} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ justifyContent: 'center' }}>
                              <MessageCircle size={14} /> WhatsApp
                            </a>
                            <Link href={`/contacto?servicio=${line.slug}&plan=${encodeURIComponent(`${tier.name} — ${lineTitle} (${planPriceText})`)}`} style={{ textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              ¿Dudas? Pedí tu diagnóstico gratis
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {line.footnote && <p className="pricing-footnote">{line.footnote}</p>}
                </motion.div>
              );
            })()}
          </div>
        </section>

        {/* Se eliminó la sección de testimonios ("Lo que dicen nuestros
            clientes" + "Más de 20 empresas ya escalaron su negocio
            contratando estos mismos servicios" + tres testimonios firmados).
            Todo inventado. La sección siguiente ("El método NEXA") ya abre el
            bloque oscuro, así que no queda hueco en el diseño. */}

        {/* ══════ Methodology ══════ */}
        <section style={{ background: '#0D0E15', padding: 'clamp(64px, 10vw, 120px) 0' }}>
          <div className="container">
            <motion.div className="section-header" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.span variants={fadeUp} className="section-tag" style={{ background: 'rgba(210,242,58,0.1)', color: '#D2F23A', border: '1px solid rgba(210,242,58,0.2)' }}>Nuestro proceso</motion.span>
              <motion.h2 variants={fadeUp} className="section-title text-white">El método NEXA</motion.h2>
              <motion.p variants={fadeUp} className="section-subtitle text-white-50" style={{ margin: '0 auto' }}>Un framework claro, aplicado a cualquier servicio que elijas, para construir marcas sostenibles y escalables.</motion.p>
            </motion.div>
            <motion.div className="method-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}>
              {STEPS.map((step) => (
                <motion.div key={step.num} variants={fadeUp} className="method-step" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }} whileHover={{ y: -6 }}>
                  <div className="method-number" style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)', color: '#D2F23A' }}>{step.num}</div>
                  <h4 style={{ color: 'white' }}>{step.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.55)' }}>{step.desc}</p>
                  <p style={{ color: '#D2F23A', fontSize: '0.78rem', fontWeight: 700, marginTop: 14 }}>{step.output}</p>
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
              Elegí un servicio, completá el formulario o escribinos directo. Sin compromiso, respuesta en menos de 24 horas.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contacto" className="btn btn-lima" style={{ fontSize: '1rem' }}>
                Quiero potenciar mi negocio <ArrowRight size={18} />
              </Link>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ fontSize: '0.95rem', padding: '16px 30px' }}>
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
