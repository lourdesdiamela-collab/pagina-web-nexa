'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NexaLogo } from './NexaLogo';

const SOCIALS = [
  { label: '@nexagrowth.ar', href: 'https://instagram.com/nexagrowth.ar' },
  { label: '@somosnexa.ar', href: 'https://instagram.com/somosnexa.ar' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/clientes/dashboard')) return null;

  return (
    <footer style={{ background: '#0d0e15', borderTop: '1px solid rgba(255,255,255,0.08)', color: 'white' }}>
      <div className="container" style={{ paddingTop: 34, paddingBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <NexaLogo size={34} color="white" />
          </Link>

          <nav style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/servicios" style={linkStyle}>Servicios</Link>
            <Link href="/casos" style={linkStyle}>Casos</Link>
            <Link href="/aprende" style={linkStyle}>Aprende con NEXA</Link>
            <Link href="/contacto" style={linkStyle}>Contacto</Link>
            <Link href="/portal" style={{ ...linkStyle, color: '#D2F23A' }}>Portal</Link>
          </nav>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem' }}>
            © 2026 NEXA. Marketing, CRM y crecimiento operacional.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SOCIALS.map((social) => (
              <a key={social.href} href={social.href} target="_blank" rel="noreferrer" style={socialBadgeStyle}>
                {social.label}
              </a>
            ))}
            <a href="mailto:hola@nexaarg.com" style={socialBadgeStyle}>hola@nexaarg.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: 'rgba(255,255,255,0.8)',
  fontWeight: 600,
  fontSize: '0.92rem',
};

const socialBadgeStyle = {
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.05)',
  color: 'white',
  padding: '6px 10px',
  fontSize: '0.82rem',
  textDecoration: 'none',
};
