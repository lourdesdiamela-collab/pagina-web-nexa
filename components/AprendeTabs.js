import Link from 'next/link';

/*
 * Selector compartido de la sección "Aprende". Deja claro que hay dos
 * formatos dentro de una misma sección: guías descargables y capacitaciones en video.
 */
export default function AprendeTabs({ active }) {
  const tabs = [
    { id: 'recursos', href: '/aprende', label: 'Guías y recursos', hint: 'Descargables para aplicar hoy' },
    { id: 'capacitaciones', href: '/soluciones-ia', label: 'Capacitaciones en video', hint: 'IA paso a paso para tu negocio' },
  ];
  return (
    <nav className="aprende-tabs" aria-label="Secciones de Aprende">
      <div className="container aprende-tabs-inner">
        {tabs.map((t) => (
          <Link key={t.id} href={t.href} className={`aprende-tab ${active === t.id ? 'is-active' : ''}`} aria-current={active === t.id ? 'page' : undefined}>
            <strong>{t.label}</strong>
            <span>{t.hint}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
