'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NexaLogo } from './NexaLogo';

const NAV_LINKS = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos', label: 'Enfoque' },
  { href: '/aprende', label: 'Aprende' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
];

/*
 * Links legales obligatorios. El Botón de Arrepentimiento, además de estar
 * acá, tiene que estar visible en la primera pantalla del sitio: en Argentina
 * la Resolución 424/2020 de Secretaría de Comercio Interior exige que esté
 * "en un lugar destacado y de fácil visualización" de la home. Por eso vive
 * también en components/ArrepentimientoBanner.js, montado en el layout raíz.
 */
const LEGAL_LINKS = [
  { href: '/terminos', label: 'Términos y Condiciones' },
  { href: '/privacidad', label: 'Política de Privacidad' },
  { href: '/arrepentimiento', label: 'Botón de Arrepentimiento' },
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
