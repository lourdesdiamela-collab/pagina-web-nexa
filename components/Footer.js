'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NexaLogo } from './NexaLogo';

const NAV_LINKS = [
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos', label: 'Casos' },
  { href: '/aprende', label: 'Aprende' },
  { href: '/blog', label: 'Blog' },
  { href: '/contacto', label: 'Contacto' },
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

        {/* Divider + Bottom */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
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