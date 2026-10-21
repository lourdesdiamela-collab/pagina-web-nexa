import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/*
 * Andamiaje compartido de las páginas legales (/terminos, /privacidad,
 * /arrepentimiento).
 *
 * Los textos de /terminos, /privacidad y /contratos/* viven en
 * lib/textosLegales.mjs y lib/contratos.mjs (pedido de Lu, octubre 2026) y se
 * muestran con <LegalSecciones />. Conviene que los revise un abogado. Si una
 * página nueva todavía no tiene texto, usar <LegalEnPreparacion /> -- un
 * aviso breve y neutro, sin detalles internos.
 */
export default function LegalPage({ title, intro, children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(100px, 12vw, 140px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 90, maxWidth: 780 }}>
          <div className="section-header" style={{ textAlign: 'left', marginBottom: 28 }}>
            <span className="section-tag">Información legal</span>
            <h1 className="section-title" style={{ marginBottom: intro ? 12 : 0 }}>{title}</h1>
            {intro && <p className="section-subtitle" style={{ margin: 0 }}>{intro}</p>}
          </div>

          <div className="legal-body">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/*
 * Aviso para el visitante mientras una página legal no tiene su contenido
 * definitivo. A propósito NO dice nada interno (quién lo redacta, en qué
 * archivo se carga, etc.) — eso es información de equipo, no para publicar.
 * Texto breve, neutro, sin aspecto de advertencia.
 */
export function LegalEnPreparacion() {
  return (
    <div className="legal-en-preparacion">
      <p>Estamos terminando de preparar el contenido de esta página.</p>
      <p>Si tenés alguna consulta mientras tanto, <Link href="/contacto">escribinos</Link> y te respondemos a la brevedad.</p>
    </div>
  );
}
