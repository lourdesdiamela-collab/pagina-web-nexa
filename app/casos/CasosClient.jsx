'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

/*
 * NOTA (septiembre 2026): se eliminó RESULTS — tres "casos de éxito"
 * inventados (Bambú Cowork +210% reservas de salas, Vetrina Hogar +275%
 * ventas online, Clínica Avanza +150% turnos agendados). NEXA no tiene
 * clientes todavía, así que no había ningún caso real detrás.
 *
 * La página se reconvirtió de "Casos de Éxito" a "Nuestro enfoque": mantiene
 * el bloque de impacto (que describe la propuesta de valor, no resultados
 * pasados) y ya no afirma tener clientes. Si preferís que la página no exista
 * más, hay que borrar app/casos/ y el link en la navegación.
 */

const IMPACTS = [
  { title: 'Dejás de improvisar', desc: 'Estrategia alineada a crecimiento real.' },
  { title: 'Ordenás tus procesos', desc: 'Todo tu mundo digital conectado.' },
  { title: 'Mejorás tu imagen', desc: 'Autoridad y profesionalismo en cada punto de contacto.' },
  { title: 'Convertís mejor', desc: 'Prospectos rentables en vez de tráfico vacío.' },
];

export default function CasosClient() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <main style={{ paddingTop: 'clamp(100px, 12vw, 140px)' }}>
        {/* Header */}
        <div className="container" style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="section-tag">Cómo trabajamos</span>
          <h1 className="section-title">Nuestro <span className="text-gradient">enfoque.</span></h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Así encaramos el marketing de un negocio: con un plan claro, procesos ordenados y decisiones tomadas con datos.
          </p>
        </div>

        {/* Se eliminaron el banner "Resultados medibles, con datos reales" y las
            tarjetas de casos de éxito (Bambú Cowork, Vetrina Hogar, Clínica
            Avanza), porque eran clientes y métricas inventados. */}

        {/* Impact Section */}
        <section className="transformation">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Impacto</span>
              <h2 className="section-title">Qué cambia cuando trabajás con NEXA</h2>
            </div>
            <div className="transform-grid">
              {IMPACTS.map((item, i) => (
                <motion.div key={i} className="transform-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="lima-dot" />
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 48 }}>
              <Link href="/contacto" className="btn btn-lima">Quiero potenciar mi negocio <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
