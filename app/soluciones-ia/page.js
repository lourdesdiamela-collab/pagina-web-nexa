import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { waHref } from '@/lib/whatsapp';
import './soluciones.css';

export const metadata = {
  title: 'Soluciones con IA para pymes y emprendedores | Kits en video — NEXA',
  description:
    'Kits en video con plantillas y flujos listos para resolver problemas reales de tu negocio con IA: WhatsApp que vende, contenido de un mes en una tarde, anuncios sin tirar plata y más. Preventa abierta.',
  alternates: { canonical: '/soluciones-ia' },
  openGraph: {
    title: 'Soluciones con IA para pymes y emprendedores — NEXA',
    description:
      'Kits en video con plantillas y flujos listos para aplicar IA a problemas reales de tu negocio. Preventa abierta.',
    url: 'https://www.nexagrowth.com.ar/soluciones-ia',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

/*
 * Los kits están en PREVENTA: se graban con feedback de quienes reservan.
 * Los precios NO se muestran hasta que Lu los confirme: cuando estén
 * definidos, completar `precio` en cada kit (ej. 'USD 29') y el precio
 * aparece solo en la tarjeta.
 */
const KITS = [
  {
    id: 'whatsapp',
    emoji: '💬',
    titulo: 'WhatsApp que vende',
    problema: 'Te escriben por WhatsApp e Instagram y tardás horas en responder: se enfrían las consultas.',
    incluye: ['Guiones y respuestas para las 15 consultas más comunes', 'Flujo de seguimiento paso a paso', 'Cómo usar IA para responder rápido sin sonar a robot'],
    formato: 'Video + plantillas',
    precio: null,
  },
  {
    id: 'marca-ia',
    emoji: '🎯',
    titulo: 'Tu marca en ChatGPT',
    problema: 'Usás IA pero todo te sale genérico y suena igual al de la competencia.',
    incluye: ['Cómo cargarle la voz, el público y el contexto de tu negocio', 'Plantillas de instrucciones para posts, mails y fichas de producto', 'Checklist para revisar antes de publicar'],
    formato: 'Video + plantillas',
    precio: null,
  },
  {
    id: 'medir-ia',
    emoji: '📊',
    titulo: 'Medí si la IA te rinde',
    problema: 'Pagás herramientas de IA y no sabés si te ahorran tiempo o plata.',
    incluye: ['Planilla para medir horas ahorradas y resultados', 'Qué indicadores mirar según tu rubro', 'Cómo decidir qué herramienta conservar y cuál descartar'],
    formato: 'Video + planilla',
    precio: null,
  },
  {
    id: 'contenido',
    emoji: '🗓️',
    titulo: 'Contenido de un mes en una tarde',
    problema: 'Publicar todos los días te come el tiempo y no tenés equipo.',
    incluye: ['Método para planificar un mes de contenido', 'Guiones e ideas con IA adaptados a tu rubro', 'Calendario editable'],
    formato: 'Video + calendario',
    precio: null,
  },
  {
    id: 'ads',
    emoji: '🚀',
    titulo: 'Anuncios sin tirar plata',
    problema: 'Invertís en Meta o Google y no sabés qué está funcionando.',
    incluye: ['Estructura de campaña simple para arrancar', 'Textos y variantes creados con IA', 'Revisión semanal en 20 minutos'],
    formato: 'Video + checklist',
    precio: null,
  },
  {
    id: 'politica-ia',
    emoji: '🛡️',
    titulo: 'Reglas de IA para tu equipo',
    problema: 'Tu equipo ya usa IA con datos de clientes y no hay reglas claras.',
    incluye: ['Modelo de política de uso listo para adaptar', 'Qué datos nunca cargar en una IA', 'Guía de implementación en una reunión'],
    formato: 'Video + documento',
    precio: null,
  },
];

const PASOS = [
  { n: '01', t: 'Reservás tu lugar', d: 'Elegís el kit que más te duele y lo reservás por WhatsApp. Sin pagar de más antes de tiempo.' },
  { n: '02', t: 'Lo armamos con vos', d: 'Grabamos los kits priorizando los problemas que más piden quienes reservan.' },
  { n: '03', t: 'Aplicás en una tarde', d: 'Recibís el video corto y los archivos listos para copiar, pegar y usar en tu negocio.' },
];

const FAQ = [
  { q: '¿Necesito saber de IA o de marketing?', a: 'No. Están pensados para dueños de pymes y emprendedores que no tienen tiempo ni equipo técnico. Se explica con ejemplos de negocios reales y archivos para usar tal cual.' },
  { q: '¿Cuándo se entregan los kits?', a: 'Están en preventa: se producen en función de la demanda. Al reservar te confirmamos por WhatsApp la fecha estimada de entrega del kit que elegiste.' },
  { q: '¿Cuánto cuestan?', a: 'Te pasamos el precio de preventa al reservar, sin compromiso de compra hasta que lo confirmes.' },
  { q: '¿Y si prefiero que lo hagan por mí?', a: 'También lo hacemos: NEXA ofrece servicios de marketing, automatización y publicidad. Podés consultarlo desde la página de servicios o por WhatsApp.' },
  { q: '¿Qué pasa con mis datos?', a: 'Solo usamos tu contacto para avisarte del kit que reservaste. Podés pedir la baja en cualquier momento.' },
];

export default function SolucionesIAPage() {
  const reservarGeneral = waHref('kits_ia_hero', 'Hola NEXA! Quiero reservar un kit de soluciones con IA para mi negocio.');

  return (
    <>
      <Navbar />
      <main className="ki-main">
        {/* HERO */}
        <section className="ki-hero">
          <div className="container ki-hero-inner">
            <span className="ki-badge"><span className="ki-dot" /> Preventa abierta</span>
            <h1 className="ki-h1">
              IA aplicada a <span className="text-gradient">problemas reales</span> de tu negocio
            </h1>
            <p className="ki-lead">
              Kits cortos en video con plantillas y flujos listos para usar. Para pymes y emprendedores que quieren resultados,
              no teoría ni cursos de 40 horas.
            </p>
            <div className="ki-cta-row">
              <a href={reservarGeneral} className="btn btn-lima" rel="noopener">Reservar mi kit</a>
              <a href="#kits" className="btn btn-outline">Ver los kits</a>
            </div>
            <p className="ki-note">Sin pago anticipado: reservás y te confirmamos precio y fecha por WhatsApp.</p>
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

        {/* KITS */}
        <section className="ki-sec" id="kits">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Kits de resultado</span>
              <h2 className="section-title">Elegí el problema que más te duele</h2>
              <p className="section-subtitle">Cada kit resuelve una sola cosa y se aplica en una tarde. Reservá el que necesitás.</p>
            </div>
            <div className="ki-grid">
              {KITS.map((k) => (
                <article key={k.id} className="ki-card">
                  <div className="ki-card-top">
                    <span className="ki-emoji" aria-hidden="true">{k.emoji}</span>
                    <span className="ki-chip">Preventa</span>
                  </div>
                  <h3>{k.titulo}</h3>
                  <p className="ki-problema">{k.problema}</p>
                  <ul className="ki-list">
                    {k.incluye.map((i) => (<li key={i}>{i}</li>))}
                  </ul>
                  <div className="ki-card-foot">
                    <span className="ki-format">{k.formato}{k.precio ? ` · ${k.precio}` : ''}</span>
                    <a
                      href={waHref(`kits_ia_${k.id}`, `Hola NEXA! Quiero reservar el kit "${k.titulo}".`)}
                      className="btn btn-primary btn-sm"
                      rel="noopener"
                    >
                      Reservar este kit
                    </a>
                  </div>
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
              <h2 className="section-title ki-white">Simple, y sin vueltas</h2>
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

        {/* QUIÉN LO HACE */}
        <section className="ki-sec ki-sec-soft">
          <div className="container ki-center">
            <span className="section-tag">Quiénes lo hacen</span>
            <h2 className="section-title">Una agencia que lo aplica todos los días</h2>
            <p className="section-subtitle">
              NEXA es una agencia de marketing y automatización con IA de Argentina. Los kits salen de lo que hacemos para nuestros clientes,
              y solo mostramos casos con autorización.
            </p>
            <div className="ki-cta-row">
              <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
              <Link href="/aprende" className="btn btn-outline">Biblioteca de guías</Link>
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
            <p className="ki-final-sub">Contanos y te decimos qué kit te conviene. Sin compromiso.</p>
            <a href={waHref('kits_ia_final', 'Hola NEXA! Quiero saber qué kit de IA me conviene para mi negocio.')} className="btn btn-lima" rel="noopener">
              Hablar por WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
