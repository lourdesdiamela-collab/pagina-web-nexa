/*
 * Muestra un texto legal armado como secciones (ver lib/contratos.mjs y
 * lib/textosLegales.mjs) dentro de <LegalPage />.
 */
export default function LegalSecciones({ secciones, version }) {
  return (
    <>
      {version && <p className="legal-version">Versión vigente: {version}</p>}
      {secciones.map((s) => (
        <section key={s.titulo}>
          <h2>{s.titulo}</h2>
          {(s.parrafos || []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {s.items?.length > 0 && (
            <ul>
              {s.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </>
  );
}
