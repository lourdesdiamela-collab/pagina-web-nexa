import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { waHref } from '@/lib/whatsapp';
import './soluciones.css';

export const metadata = {
  title: 'Kits IA para pymes y emprendedores | Mini capacitaciones — NEXA',
  description:
    'Mini capacitaciones en video con plantillas y flujos listos para resolver problemas reales de tu negocio con IA: WhatsApp e Instagram que venden, contenido con IA, anuncios y más. Kits disponibles a $49.999 c/u.',
  alternates: { canonical: '/soluciones-ia' },
  openGraph: {
    title: 'Soluciones con IA para pymes y emprendedores — NEXA',
    description:
      'Mini capacitaciones en video con plantillas y flujos listos para aplicar IA a problemas reales de tu negocio. Ya disponible.',
    url: 'https://www.nexagrowth.com.ar/soluciones-ia',
    images: [{ url: '/img/kit-ia-portada.jpg', width: 1600, height: 900, alt: 'Kit IA de NEXA: WhatsApp e Instagram que venden' }],
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

/*
 * Capacitación 1 en PREVENTA ($49.999). Las demás figuran como "próximamente"
 * y se abren según la demanda que muestre la preventa.
 * Cobro: Mercado Pago desde /soluciones-ia/comprar; el kit llega por mail al acreditarse el pago.
 */
const KITS = [
  {
    id: 'whatsapp',
    slug: 'whatsapp-instagram',
    emoji: '💬',
    estado: 'disponible',
    titulo: 'WhatsApp e Instagram que venden',
    problema: 'Te escriben por WhatsApp e Instagram, tardás en responder y las consultas se enfrían.',
    incluye: [
      'Guía paso a paso en 7 partes para armar tu sistema de atención y seguimiento',
      'Video explicativo de unos 6 minutos para empezar con el pie derecho',
      'Banco de 25 respuestas y 6 guiones de seguimiento listos para adaptar',
      'Cómo usar la IA como ayudante para redactar y revisar tus respuestas',
      'Planilla de leads para medir cuántas consultas se vuelven ventas',
    ],
    formato: 'Guía + video + plantillas + planilla',
    precio: '$49.999',
  },
  {
    id: 'contenido',
    slug: 'contenido',
    emoji: '🗓️',
    estado: 'disponible',
    titulo: 'Contenido de un mes con IA',
    problema: 'Publicar todos los días te come el tiempo y no tenés equipo.',
    incluye: [
      'Guía paso a paso para definir la voz de tu marca y armar el calendario de un mes',
      'Guiones e ideas con IA adaptados a tu rubro',
      'Plantillas para copiar y pegar y checklist de revisión antes de publicar',
      'Video de bienvenida, guía interactiva en el navegador y la misma guía en PDF',
    ],
    formato: 'Video + guía interactiva + PDF + plantillas',
    precio: '$49.999',
  },
  {
    id: 'ads',
    slug: 'anuncios',
    emoji: '🚀',
    estado: 'disponible',
    titulo: 'Anuncios en Meta y Google sin tirar plata',
    problema: 'Invertís en publicidad y no sabés qué está funcionando.',
    incluye: [
      'Estructura de campaña simple para arrancar en Meta y Google',
      'Textos y variantes de anuncios con IA',
      'Revisión semanal en 20 minutos para saber qué sigue y qué se corta',
      'Video de bienvenida, guía interactiva en el navegador y la misma guía en PDF',
    ],
    formato: 'Video + guía interactiva + PDF + checklist',
    precio: '$49.999',
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
  { e: '🎬', t: 'Guía y video corto', d: 'Una guía paso a paso y un video para empezar, con ejemplos de negocios reales y sin teoría de más.' },
  { e: '📋', t: 'Plantillas listas', d: 'Textos, guiones y planillas para copiar, pegar y adaptar a tu marca.' },
  { e: '🎯', t: 'Un solo problema', d: 'Cada kit resuelve una cosa concreta, por ejemplo responder rápido por WhatsApp.' },
];

const PASOS = [
  { n: '01', t: 'Comprás online', d: 'Completás tu nombre y tu mail, aceptás los términos y pagás con Mercado Pago. No hace falta crear cuenta.' },
  { n: '02', t: 'Te llega por mail', d: 'Apenas se acredita el pago, te enviamos un botón para abrir y descargar tu kit. También lo ves en pantalla al terminar de pagar.' },
  { n: '03', t: 'Aplicás en una tarde', d: 'Abrís la guía, mirás el video corto y copiás las plantillas para usarlas en tu negocio.' },
];

const FAQ = [
  { q: '¿Qué incluyen los kits de Contenido y de Anuncios?', a: 'Cada uno trae un video de bienvenida, una guía interactiva paso a paso (se abre en el navegador, con herramientas para completar) y la misma guía en PDF para descargar, con plantillas para copiar y pegar, checklists e ilustraciones.' },
  { q: '¿Qué incluye el Kit 1?', a: 'Una guía interactiva paso a paso (se abre en el navegador), la misma guía en PDF para descargar, un video de bienvenida de unos 6 minutos, 25 respuestas y 6 guiones de seguimiento para WhatsApp e Instagram, y una planilla para medir cuántas consultas se vuelven ventas.' },
  { q: '¿Cómo pago?', a: 'Con Mercado Pago, con tarjeta de crédito, débito u otros medios que te ofrezca al pagar. Tus datos de pago los maneja Mercado Pago: nosotros nunca los vemos. No necesitás crear una cuenta en nuestro sitio.' },
  { q: '¿Cuándo y cómo lo recibo?', a: 'En el momento en que se acredita el pago te llega un mail con un botón para abrir y descargar el kit. Al terminar de pagar también lo ves en pantalla. Si en unos minutos no te llegó, revisá spam o promociones; si sigue sin aparecer, escribinos por WhatsApp con el mail que usaste.' },
  { q: '¿Necesito saber de IA o de marketing?', a: 'No. Está pensado para dueños de pymes y emprendedores sin tiempo ni equipo técnico. Se explica con ejemplos de negocios reales y archivos para usar tal cual.' },
  { q: '¿Qué necesito para usarlo?', a: 'Un celular o una computadora, tu WhatsApp (mejor si es WhatsApp Business) o tu Instagram, y alguna herramienta de IA de chat; hay opciones gratuitas. Para la planilla de leads alcanza con tu navegador.' },
  { q: '¿Por cuánto tiempo puedo acceder?', a: 'El enlace de tu mail funciona durante 60 días. En ese tiempo podés abrirlo online y descargar la guía, el PDF y el video; una vez descargados, son tuyos. Si el enlace venció o lo perdiste, escribinos con el mail de tu compra y te mandamos uno nuevo.' },
  { q: '¿Me garantizan más ventas?', a: 'No. Te damos un método, textos y una planilla para ordenar tu atención. Los resultados dependen de tu negocio y de cómo lo apliques. Nadie puede prometerte un número de ventas.' },
  { q: '¿Puedo arrepentirme de la compra?', a: 'Sí. Podés revocar la compra dentro de los 10 días corridos desde que la hiciste, desde la página de arrepentimiento. Si ya descargaste el contenido para uso permanente, puede aplicar una excepción legal, y lo analizamos juntos. Si tuviste un problema para acceder o recibirlo, escribinos y lo resolvemos.' },
  { q: '¿Puedo compartirlo o revenderlo?', a: 'Es para tu uso personal o el de tu negocio. No se puede revender ni compartir públicamente, ni completo ni en partes.' },
  { q: '¿Cuándo salen los otros kits?', a: 'Se abren según la demanda. Si alguno te interesa, tocá "Avisarme cuando salga" y te escribimos cuando esté listo.' },
  { q: '¿Y si prefiero que lo hagan por mí?', a: 'También lo hacemos: NEXA ofrece servicios de marketing, automatización y publicidad. Podés verlos en la página de servicios o consultarnos por WhatsApp.' },
  { q: '¿Qué pasa con mis datos?', a: 'Usamos tu nombre y tu mail solo para entregarte el kit y avisarte de novedades que pidas. Las herramientas del kit, como la planilla, guardan lo que cargues en tu propio dispositivo. Podés pedir la baja cuando quieras.' },
];

export default function SolucionesIAPage() {

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />
      <Navbar />
      <main className="ki-main">
        {/* HERO */}
        <section className="ki-hero">
          <div className="container ki-hero-inner">
            <span className="ki-badge"><span className="ki-dot" /> Kits IA de NEXA · Ya disponible</span>
            <h1 className="ki-h1">
              Usá IA en tu negocio, <span className="text-gradient">paso a paso</span>
            </h1>
            <p className="ki-lead">
              Un Kit IA es una mini capacitación con guía paso a paso y plantillas listas para copiar y pegar.
              Cada kit resuelve un solo problema y lo aplicás en una tarde.
            </p>
            <ul className="ki-pills">
              <li>🎬 Guía interactiva y PDF</li>
              <li>📋 Plantillas listas</li>
              <li>⚡ Se aplica en una tarde</li>
            </ul>
            <div className="ki-cta-row">
              <a href="#kits" className="btn btn-lima">Elegir mi kit</a>
              <a href="/soluciones-ia/comprar" className="btn btn-outline">Comprar el Kit 1</a>
            </div>
            <p className="ki-note">Pagás con Mercado Pago y el kit te llega por mail al instante. Sin crear cuenta.</p>
            <img className="ki-cover" src="/img/kit-ia-portada.jpg" alt="Kit IA de NEXA: WhatsApp e Instagram que venden. 25 respuestas, 6 guiones de seguimiento y planilla de leads." width="1600" height="900" />
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
              <h2 className="section-title">Elegí tu kit</h2>
              <p className="section-subtitle">Hay tres kits listos. Los demás se abren según la demanda: avisanos cuál te interesa.</p>
            </div>

            {KITS.filter((k) => k.estado === 'disponible').map((k) => (
            <article key={k.id} className="ki-feature" style={{ marginBottom: 24 }}>
              <div className="ki-feature-main">
                <span className="ki-chip">Disponible</span>
                <h3>{k.emoji} {k.titulo}</h3>
                <p className="ki-problema"><strong>El problema:</strong> {k.problema}</p>
                <div className="ki-feature-price">{k.precio}<small> pago único</small></div>
                <a href={`/soluciones-ia/comprar?kit=${k.slug}`} className="btn btn-primary">
                  Comprar ahora
                </a>
              </div>
              <div className="ki-feature-incl">
                <h4>Qué incluye</h4>
                <ul className="ki-list">
                  {k.incluye.map((i) => (<li key={i}>{i}</li>))}
                </ul>
              </div>
            </article>
            ))}

            <h3 className="ki-next-title">Próximos kits</h3>
            <div className="ki-grid ki-grid-4">
              {KITS.filter((k) => k.estado !== 'disponible').map((k) => (
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
        <section className="ki-sec">
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
              <h2 className="section-title">Todo sobre los Kits IA</h2>
              <p className="section-subtitle">Compra, entrega, acceso y devoluciones, en pocas líneas.</p>
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
