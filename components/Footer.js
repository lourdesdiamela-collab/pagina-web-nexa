'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

const NAV_LINKS = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos', label: 'Enfoque' },
  { href: '/aprende', label: 'Aprende' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

/*
 * Links legales obligatorios.
 *
 * NOTA (octubre 2026): el comentario anterior decía que el Botón de
 * Arrepentimiento vivía también en "components/ArrepentimientoBanner.js,
 * montado en el layout raíz". Ese archivo NO EXISTE en el proyecto: o se
 * borró en algún momento o nunca se creó. Se corrigió la nota para que no
 * mande a buscar un componente inexistente.
 *
 * El botón estaba además en el menú principal (components/Navbar.js) y se
 * sacó de ahí, porque en el menú de una agencia compite con los accesos
 * comerciales. Ahora el pie es su único lugar, así que acá abajo tiene su
 * propia franja destacada en vez de ser un link más entre los otros dos.
 *
 * La Resolución 424/2020 de Secretaría de Comercio Interior pide que el botón
 * esté "en un lugar destacado y de fácil visualización". Un pie con franja
 * propia es una interpretación razonable y es lo que hace buena parte del
 * comercio electrónico argentino, pero conviene validarlo con asesoramiento
 * legal. Si hiciera falta tenerlo visible sin scroll, la forma de hacerlo sin
 * ensuciar el menú es una franja legal fina arriba del header.
 */
const LEGAL_LINKS = [
  { href: '/terminos', label: 'Términos y Condiciones' },
  { href: '/privacidad', label: 'Política de Privacidad' },
];

const SOCIALS = [
  { label: '@nexagrowth.ar', href: 'https://instagram.com/nexagrowth.ar' },
  { label: '@somosnexa.ar', href: 'https://instagram.com/somosnexa.ar' },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer style={{ background: '#0D0E15', borderTop: '1px solid rgba(255,255,255,0.06)', color: 'white' }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 32 }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <Link href="/" aria-label="NEXA Inicio">
              <NexaLogo size={32} color="white" />
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginTop: 12, maxWidth: 280, lineHeight: 1.6 }}>
              Marketing, CRM y crecimiento operacional para marcas que quieren escalar.
            </p>
          </div>

          <nav style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }} aria-label="Enlaces del footer">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.3s' }}>
                {link.label}
              </Link>
            ))}
            <a href="https://crm.nexagrowth.com.ar" target="_blank" rel="noopener noreferrer" style={{ color: '#D2F23A', fontWeight: 700, fontSize: '0.9rem' }}>
              Portal NEXA OS
            </a>
          </nav>
        </div>

        {/* Franja legal: links obligatorios */}
        <div className="footer-legal-row">
          <nav className="footer-legal-links" aria-label="Enlaces legales">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </nav>
        </div>

        {/*
          Botón de Arrepentimiento con presencia propia. Al salir del menú
          principal, este pasó a ser su único lugar en el sitio, así que va
          destacado y con el encuadre legal explícito en vez de quedar como un
          link suelto entre Términos y Privacidad.
        */}
        <div
          style={{
            marginTop: 16,
            padding: '14px 18px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', lineHeight: 1.5 }}>
            ¿Compraste algo y querés dar marcha atrás? Tenés 10 días corridos
            para arrepentirte, sin costo y sin tener que dar explicaciones.
          </span>
          <Link
            href="/arrepentimiento"
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.28)',
              padding: '9px 18px',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.84rem',
            }}
          >
            <RotateCcw size={14} /> Botón de Arrepentimiento
          </Link>
        </div>

        {/* Divider + Bottom */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
            © {new Date().getFullYear()} NEXA. Todos los derechos reservados.
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SOCIALS.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" style={{ borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', padding: '6px 14px', fontSize: '0.82rem', transition: 'all 0.3s' }}>
                {s.label}
              </a>
            ))}
            <a href="mailto:hola@nexaarg.com" style={{ borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', padding: '6px 14px', fontSize: '0.82rem' }}>
              hola@nexaarg.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
