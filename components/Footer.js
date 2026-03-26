'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NexaLogo } from './NexaLogo';

const InstaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/clientes/dashboard')) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-logo"><Link href="/"><NexaLogo size={32} /></Link></div>
          <div className="footer-links">
            <Link href="/servicios">Servicios</Link>
            <Link href="/casos">Casos de Éxito</Link>
            <Link href="/aprende">Aprende con NEXA</Link>
            <Link href="/contacto" style={{ color: '#B89BFF' }}>Hablemos de tu marca</Link>
            <Link href="/clientes" className="footer-portal-link">Área Clientes</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>© 2026 NEXA STRATEGY. LAB DIGITAL ESTRATÉGICO.</span>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
              <span>Hola@nexaarg.com</span>
              <span>+54 9 11 XXXX-XXXX</span>
            </div>
          </div>
          <div className="social-links-pro">
            <a href="https://instagram.com/nexagrowth.ar" target="_blank" rel="noreferrer" className="social-badge" style={{ background: 'rgba(184, 155, 255, 0.1)', color: '#B89BFF', border: '1px solid rgba(184, 155, 255, 0.2)' }}><InstaIcon /> @nexagrowth.ar</a>
            <a href="https://instagram.com/somosnexa.ar" target="_blank" rel="noreferrer" className="social-badge" style={{ background: 'rgba(210, 242, 58, 0.1)', color: '#D2F23A', border: '1px solid rgba(210, 242, 58, 0.2)' }}><InstaIcon /> @somosnexa.ar</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-badge icon-only" style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}><LinkedinIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
