import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/*
 * Andamiaje compartido de las páginas legales (/terminos, /privacidad,
 * /arrepentimiento).
 *
 * IMPORTANTE: el texto legal lo escribe Lu (o su asesoría legal). Acá no hay
 * ni debe haber texto legal redactado por nadie más. Mientras una página no
 * tenga su contenido definitivo, se usa <LegalEnPreparacion /> -- un aviso
 * breve y neutro para el visitante, sin ningún detalle interno ni de
 * implementación. Nunca mostrar acá instrucciones internas del equipo.
 *
 * Para completar una página: abrir el archivo app/<ruta>/page.js y reemplazar
 * el bloque <LegalEnPreparacion /> por el texto, usando <h2> para los
 * títulos de sección y <p> para los párrafos.
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
