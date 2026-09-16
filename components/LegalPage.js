import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

/*
 * Andamiaje compartido de las páginas legales (/terminos, /privacidad,
 * /arrepentimiento).
 *
 * IMPORTANTE: el texto legal lo escribe Lu. Acá no hay ni debe haber texto
 * legal redactado por nadie más: cada página muestra el marcador
 * [FALTA: texto de Lu] hasta que ella pase el contenido definitivo.
 *
 * Para completar una página: abrir el archivo app/<ruta>/page.js y reemplazar
 * el bloque <LegalPlaceholder /> por el texto, usando <h2> para los títulos de
 * sección y <p> para los párrafos.
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
 * Marcador visible mientras falte el texto. Se ve en pantalla a propósito:
 * es preferible que se note que falta a que la página parezca completa.
 */
export function LegalPlaceholder({ nota }) {
  return (
    <div className="legal-placeholder">
      <strong>[FALTA: texto de Lu]</strong>
      <p>
        Esta página todavía no tiene su contenido legal. El texto lo redacta Lu
        (o su asesoría legal) y se carga en el archivo de esta ruta.
      </p>
      {nota && <p>{nota}</p>}
    </div>
  );
}
