import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { waHref } from '@/lib/whatsapp';
import './soluciones.css';

export const metadata = {
  title: 'Kits IA para pymes y emprendedores | Mini capacitaciones — NEXA',
  description:
    'Mini capacitaciones en video con plantillas y flujos listos para resolver problemas reales de tu negocio con IA: WhatsApp e Instagram que venden, contenido con IA, anuncios y más. Primera capacitación en preventa: $49.999.',
  alternates: { canonical: '/soluciones-ia' },
  openGraph: {
    title: 'Soluciones con IA para pymes y emprendedores — NEXA',
    description:
      'Mini capacitaciones en video con plantillas y flujos listos para aplicar IA a problemas reales de tu negocio. Preventa abierta.',
    url: 'https://www.nexagrowth.com.ar/soluciones-ia',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

/*
 * Capacitación 1 en PREVENTA ($49.999). Las demás figuran como "próximamente"
 * y se abren según la demanda que muestre la preventa.
 * Cobro: por ahora se coordina por WhatsApp (se pasan los datos de pago al reservar).
 */
const KITS = [
  {
    id: 'whatsapp',
    emoji: '💬',
    estado: 'preventa',
    titulo: 'WhatsApp e Instagram que venden',
    problema: 'Te escriben por WhatsApp e Instagram, tardás en responder y las consultas se enfrían.',
    incluye: [
      '7 módulos en video (unos 100 minutos) para armar tu sistema de atención y seguimiento',
      'Banco de 25 respuestas y 6 guiones de seguimiento listos para adaptar',
      'Cómo usar la IA como ayudante para redactar y revisar tus respuestas',
      'Planilla de leads para medir cuántas consultas se vuelven ventas',
    ],
    formato: 'Video + plantillas + planilla',
    precio: '$49.999',
  },
  {
    id: 'contenido',
    emoji: '🗓️',
    estado: 'proximamente',
    titulo: 'Contenido de un mes con IA',
    problema: 'Publicar todos los días te come el tiempo y no tenés equipo.',
    incluye: ['Voz de marca y calendario de un mes', 'Guiones e ideas con IA para tu rubro', 'Plantillas y checklist de revisión'],
    formato: 'Video + plantillas',
    precio: null,
  },
  {
    id: 'ads',
    emoji: '🚀',
    estado: 'proximamente',
    titulo: 'Anuncios en Meta y Google sin tirar plata',
    problema: 'Invertís en publicidad y no sabés qué está funcionando.',
    incluye: ['Estructura de campaña simple para arrancar', 'Textos y variantes con IA', 'Revisión semanal en 20 minutos'],
    formato: 'Video + checklist',
    precio: null,
  },
  {
    id: 'ordena-ia',
    emoji: '📊',
    estado: 'proximamente',
    titulo: 'Ordená la IA en tu negocio',
    problema: 'Pagás herramientas de IA sin saber si rinden, y tu equipo las usa sin reglas.',
    incluye: ['Planilla para medir ahorro y resultados', 'Política de uso lista para adaptar', 'Qué datos nunca cargar en una IA'],
    formato: 'Video + planilla + documento',
    precio: null,
  },
  {
    id: 'seo-ia',
    emoji: '🔎',
    estado: 'proximamente',
    titulo: 'Que las IA te recomienden',
    problema: 'Ahora la gente le pregunta a una IA en vez de buscar en Google, y tu negocio no aparece.',
    incluye: ['Cómo responden los asistentes de IA', 'Contenido que suelen citar', 'Auditoría guiada de tu web'],
    formato: 'Video + checklist',
    precio: null,
  },
];

const QUE_ES = [
  { e: '🎬', t: 'Un video corto', d: 'Te explica el paso a paso, con ejemplos de negocios reales y sin teoría de más.' },
  { e: '📋', t: 'Plantillas listas', d: 'Textos, guiones y planillas para copiar, pegar y adaptar a tu marca.' },
  { e: '🎯', t: 'Un solo problema', d: 'Cada kit resuelve una cosa concreta, por ejemplo responder rápido por WhatsApp.' },
];

const PASOS = [
  { n: '01', t: 'Reservás tu lugar', d: 'Reservás tu lugar por WhatsApp y te pasamos los datos de pago.' },
  { n: '02', t: 'Lo armamos con vos', d: 'Terminamos la capacitación con feedback de quienes reservan y te confirmamos la fecha de entrega.' },
  { n: '03', t: 'Aplicás en una tarde', d: 'Recibís el video corto y los archivos listos para copiar, pegar y usar en tu negocio.' },
];

const FAQ = [
  { q: '¿Necesito saber de IA o de marketing?', a: 'No. Están pensados para dueños de pymes y emprendedores que no tienen tiempo ni equipo técnico. Se explica con ejemplos de negocios reales y archivos para usar tal cual.' },
  { q: '¿Cuándo se entrega?', a: 'La primera capacitación está en preventa: al reservar te confirmamos por WhatsApp la fecha de entrega. Las demás se abren según la demanda.' },
  { q: '¿Cuánto cuestan?', a: 'La primera capacitación sale $49.999 (pago único). Las próximas se anuncian al abrirlas, y quienes pidan que les avisemos se enteran primero.' },
  { q: '¿Y si prefiero que lo hagan por mí?', a: 'También lo hacemos: NEXA ofrece servicios de marketing, automatización y publicidad. Podés consultarlo desde la página de servicios o por WhatsApp.' },
  { q: '¿Qué pasa con mis datos?', a: 'Solo usamos tu contacto para avisarte de la capacitación que reservaste. Podés pedir la baja en cualquier momento.' },
];

export default function SolucionesIAPage() {
  const reservarGeneral = waHref('kits_ia_hero', 'Hola NEXA! Quiero reservar mi lugar en una capacitación de IA para mi negocio.');

  return (
    <>
      <Navbar />
      <main className="ki-main">
        {/* HERO */}
        <section className="ki-hero">
          <div className="container ki-hero-inner">
            <span className="ki-badge"><span className="ki-dot" /> Kits IA de NEXA · Preventa abierta</span>
            <h1 className="ki-h1">
              Usá IA en tu negocio, <span className="text-gradient">paso a paso</span>
            </h1>
            <p className="ki-lead">
              Un Kit IA es una mini capacitación en video con plantillas listas para copiar y pegar.
              Cada kit resuelve un solo problema y lo aplicás en una tarde.
            </p>
            <ul className="ki-pills">
              <li>🎬 Video corto</li>
              <li>📋 Plantillas listas</li>
              <li>⚡ Se aplica en una tarde</li>
            </ul>
            <div className="ki-cta-row">
              <a href={reservarGeneral} className="btn btn-lima" rel="noopener">Reservar mi lugar</a>
              <a href="#kits" className="btn btn-outline">Ver los kits</a>
            </div>
            <p className="ki-note">Reservás por WhatsApp y te pasamos los datos de pago y la fecha de entrega.</p>
          </div>
        </section>

        {/* QUÉ ES UN KIT */}
        <section className="ki-sec ki-sec-soft">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Qué es un Kit IA</span>
              <h2 className="section-title">Todo lo que necesitás para resolver una cosa</h2>
            </div>
            <div className="ki-what">
              {QUE_ES.map((q) => (
                <div key={q.t} className="ki-what-card">
                  <span className="ki-what-emoji" aria-hidden="true">{q.e}</span>
                  <h3>{q.t}</h3>
                  <p>{q.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KITS */}
        <section className="ki-sec" id="kits">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Los kits</span>
              <h2 className="section-title">Arrancá con el primero</h2>
              <p className="section-subtitle">Ya está en preventa. Los demás se abren según la demanda: avisanos cuál te interesa.</p>
            </div>

            <article className="ki-feature">
              <div className="ki-feature-main">
                <span className="ki-chip">Preventa</span>
                <h3>{KITS[0].emoji} {KITS[0].titulo}</h3>
                <p className="ki-problema"><strong>El problema:</strong> {KITS[0].problema}</p>
                <div className="ki-feature-price">{KITS[0].precio}<small> pago único</small></div>
                <a
                  href={waHref('kits_ia_whatsapp', `Hola NEXA! Quiero reservar mi lugar en el kit "${KITS[0].titulo}" (${KITS[0].precio}).`)}
                  className="btn btn-primary"
                  rel="noopener"
                >
                  Reservar mi lugar
                </a>
              </div>
              <div className="ki-feature-incl">
                <h4>Qué incluye</h4>
                <ul className="ki-list">
                  {KITS[0].incluye.map((i) => (<li key={i}>{i}</li>))}
                </ul>
              </div>
            </article>

            <h3 className="ki-next-title">Próximos kits</h3>
            <div className="ki-grid ki-grid-4">
              {KITS.slice(1).map((k) => (
                <article key={k.id} className="ki-card ki-card-compact">
                  <div className="ki-card-top">
                    <span className="ki-emoji" aria-hidden="true">{k.emoji}</span>
                    <span className="ki-chip ki-chip-soon">Próximamente</span>
                  </div>
                  <h3>{k.titulo}</h3>
                  <p className="ki-problema">{k.problema}</p>
                  <a
                    href={waHref(`kits_ia_${k.id}`, `Hola NEXA! Quiero que me avisen cuando salga el kit "${k.titulo}".`)}
                    className="ki-notify"
                    rel="noopener"
                  >
                    Avisarme cuando salga →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="ki-sec ki-sec-dark">
          <div className="container">
            <div className="section-header">
              <span className="section-tag ki-tag-dark">Cómo funciona</span>
              <h2 className="section-title ki-white">Cómo conseguís tu kit</h2>
            </div>
            <div className="ki-steps">
              {PASOS.map((p) => (
                <div key={p.n} className="ki-step">
                  <span className="ki-step-n">{p.n}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PARA QUIÉN */}
        <section className="ki-sec">
          <div className="container ki-two">
            <div className="ki-box">
              <h3>Es para vos si…</h3>
              <ul className="ki-list">
                <li>Tenés una pyme o un emprendimiento y poco tiempo.</li>
                <li>Ya probaste IA pero no sabés cómo aplicarla a tu negocio.</li>
                <li>Querés plantillas y pasos claros, no teoría.</li>
                <li>Vendés por WhatsApp, Instagram o tienda online.</li>
              </ul>
            </div>
            <div className="ki-box ki-box-soft">
              <h3>Quizás no es para vos si…</h3>
              <ul className="ki-list">
                <li>Buscás una carrera o un certificado.</li>
                <li>Querés programar o desarrollar modelos de IA.</li>
                <li>Preferís delegar todo: para eso están nuestros servicios.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* DATOS */}
        <section className="ki-sec ki-sec-soft">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">El problema es de aplicación</span>
              <h2 className="section-title">Todos usan IA. Pocos la usan bien.</h2>
              <p className="section-subtitle">
                Según una encuesta nacional a 402 pymes argentinas (nadIA, CEPE Di Tella y Fundar; relevada entre noviembre y diciembre de 2025),
                la herramienta ya llegó. Lo que falta es saber aplicarla y medirla.
              </p>
            </div>
            <div className="ki-stats">
              <div className="ki-stat"><strong>41,6%</strong><span>de las pymes ya usa al menos una herramienta de IA</span></div>
              <div className="ki-stat"><strong>57,4%</strong><span>no mide formalmente el impacto que le genera</span></div>
              <div className="ki-stat"><strong>46,2%</strong><span>declara falta de experiencia y conocimiento como barrera</span></div>
              <div className="ki-stat"><strong>72,5%</strong><span>de las usuarias no tiene política de uso de IA</span></div>
            </div>
            <p className="ki-source">
              Fuente:{' '}
              <a href="https://www.perfil.com/noticias/economia/cuatro-de-cada-diez-pymes-argentinas-ya-usan-ia-pero-pocas-miden-su-impacto-a40.phtml" target="_blank" rel="noopener noreferrer">
                Perfil, 29/04/2026
              </a>
            </p>
          </div>
        </section>

        {/* QUIÉN LO HACE */}
        <section className="ki-sec ki-sec-soft">
          <div className="container ki-center">
            <span className="section-tag">Quiénes lo hacen</span>
            <h2 className="section-title">Una agencia que lo aplica todos los días</h2>
            <p className="section-subtitle">
              NEXA es una agencia de marketing y automatización con IA de Argentina. Las capacitaciones salen de lo que hacemos para nuestros clientes,
              y solo mostramos casos con autorización.
            </p>
            <div className="ki-cta-row">
              <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="ki-sec">
          <div className="container ki-faq-wrap">
            <div className="section-header">
              <span className="section-tag">Preguntas frecuentes</span>
              <h2 className="section-title">Antes de reservar</h2>
            </div>
            <div className="ki-faq">
              {FAQ.map((f) => (
                <details key={f.q} className="ki-faq-item">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="ki-final">
          <div className="container ki-center">
            <h2 className="ki-white ki-final-title">¿Cuál es el problema que querés resolver primero?</h2>
            <p className="ki-final-sub">Contanos y te decimos qué capacitación te conviene. Sin compromiso.</p>
            <a href={waHref('kits_ia_final', 'Hola NEXA! Quiero saber qué capacitación de IA me conviene para mi negocio.')} className="btn btn-lima" rel="noopener">
              Hablar por WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
