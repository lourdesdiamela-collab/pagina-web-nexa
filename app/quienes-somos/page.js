import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './quienes.css';

export const metadata = {
  title: 'Quiénes somos | NEXA',
  description:
    'Desde 2019 acompañamos a pymes y emprendedores a lograr lo que se propusieron: ordenamos su marketing, hacemos crecer sus redes y su publicidad, y medimos qué funciona.',
  alternates: { canonical: '/quienes-somos' },
  openGraph: {
    title: 'Quiénes somos | NEXA',
    description: 'Desde 2019 acompañamos a pymes y emprendedores a lograr lo que se propusieron.',
    url: 'https://www.nexagrowth.com.ar/quienes-somos',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

const CREENCIAS = [
  { e: '🧭', t: 'Orden antes que volumen', d: 'Publicar más no sirve si no hay un plan. Primero ordenamos qué decir, a quién y por dónde.' },
  { e: '📏', t: 'Medir lo que importa', d: 'Cada acción tiene un objetivo y se mide. Lo que no funciona, se ajusta o se deja.' },
  { e: '🗒️', t: 'Todo claro y por escrito', d: 'Sin jerga y sin letra chica. Recibís un informe mensual que se entiende.' },
  { e: '🤝', t: 'Personas con IA, no IA sola', d: 'La inteligencia artificial nos ayuda a ir más rápido. Las decisiones las toma una persona que conoce tu negocio.' },
];

const PASOS = [
  { n: '01', t: 'Diagnóstico', d: 'Miramos tu marca, tus redes y tu competencia. Sin cargo y sin compromiso.' },
  { n: '02', t: 'Plan y ejecución', d: 'Armamos el calendario, las piezas y las campañas. Vos aprobás todo desde tu portal.' },
  { n: '03', t: 'Medimos y mejoramos', d: 'Cada mes, un informe por escrito con lo que funcionó y qué sigue.' },
];

export default function QuienesSomosPage() {
  return (
    <>
      <Navbar />
      <main className="qs-main">
        <section className="qs-hero">
          <div className="container qs-hero-grid">
            <div>
              <span className="section-tag">Quiénes somos</span>
              <h1 className="qs-h1">
                Desde 2019 acompañamos a pymes y emprendedores a{' '}
                <span className="text-gradient">lograr lo que se propusieron</span>
              </h1>
              <p className="qs-lead">
                Empezamos con una idea simple: que cualquier negocio, sin importar su tamaño, tenga el orden y las herramientas de una empresa grande, sin la complejidad ni los costos.
              </p>
              <div className="qs-cta-row">
                <Link href="/contacto" className="btn btn-lima">Pedí tu diagnóstico gratis</Link>
                <Link href="/servicios" className="btn btn-outline">Ver servicios</Link>
              </div>
            </div>
            <div className="qs-video-wrap">
              <video
                className="qs-video"
                src="/nexa-quienes-somos.mp4"
                poster="/nexa-quienes-somos-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="NEXA: quiénes somos. Desde 2019 acompañamos a pymes y emprendedores a lograr lo que se propusieron."
              />
            </div>
          </div>
        </section>

        <section className="qs-sec">
          <div className="container qs-story">
            <h2 className="section-title">Qué hacemos</h2>
            <p>
              Trabajamos codo a codo con pymes y emprendedores para ordenar su marketing, hacer crecer sus redes y su publicidad, y medir qué funciona de verdad.
              Nos ocupamos del contenido, de los anuncios en Meta y Google Ads y del seguimiento de tus clientes, para que puedas dedicarte a tu negocio.
            </p>
            <p className="qs-strong">Tu objetivo es el nuestro.</p>
          </div>
        </section>

        <section className="qs-sec qs-sec-soft">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">En qué creemos</span>
              <h2 className="section-title">Cuatro ideas que guían nuestro trabajo</h2>
            </div>
            <div className="qs-grid">
              {CREENCIAS.map((c) => (
                <div key={c.t} className="qs-card">
                  <span className="qs-emoji" aria-hidden="true">{c.e}</span>
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="qs-sec qs-dark">
          <div className="container">
            <div className="section-header">
              <span className="section-tag qs-tag-dark">Cómo trabajamos</span>
              <h2 className="section-title qs-white">Simple, en tres pasos</h2>
            </div>
            <div className="qs-steps">
              {PASOS.map((p) => (
                <div key={p.n} className="qs-step">
                  <span className="qs-step-n">{p.n}</span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="qs-final">
          <div className="container qs-center">
            <h2 className="qs-white qs-final-title">¿Empezamos por ordenar tu marketing?</h2>
            <p className="qs-final-sub">Contanos de tu negocio y te respondemos en menos de 24 hs. Sin cargo y sin compromiso.</p>
            <Link href="/contacto" className="btn btn-lima">Pedí tu diagnóstico gratis</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
