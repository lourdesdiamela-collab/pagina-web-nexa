'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, Sparkles } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/clientes/dashboard')) return null;

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Casos', path: '/casos' },
    { name: 'Aprende con NEXA', path: '/aprende' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link href="/" className="nav-logo"><NexaLogo /></Link>
        <div className="nav-links hidden lg:flex">
          {links.map(l => (
            <Link key={l.name} href={l.path} className={`nav-link ${pathname === l.path ? 'active' : ''}`}>{l.name}</Link>
          ))}
          <div className="hidden lg:flex items-center ml-4 gap-3">
            <Link href="/portal" className="nav-portal-btn flex items-center gap-2">
              <User className="nav-portal-icon" size={18} />
              <span>Clientes</span>
            </Link>
            <Link href="/admin/login" className="nav-admin-btn flex items-center gap-2" style={{
              background: 'rgba(210, 242, 58, 0.1)',
              color: '#D2F23A',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
              border: '1px solid rgba(210, 242, 58, 0.2)',
              transition: 'all 0.3s'
            }}>
            <span>Equipo NEXA</span>
            </Link>
          </div>
        </div>
        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className="mobile-menu"
        style={{ height: isMobileMenuOpen ? 'calc(100vh - 72px)' : '0', opacity: isMobileMenuOpen ? 1 : 0 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', gap: '4px', height: '100%', overflowY: 'auto' }}>
          {links.map(l => (
            <Link
              key={l.name}
              href={l.path}
              style={{
                fontSize: '1.2rem', fontWeight: 700, padding: '16px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: pathname === l.path ? '#B89BFF' : 'rgba(255,255,255,0.85)',
                textAlign: 'center', transition: 'color 0.2s', display: 'block'
              }}
              onClick={() => setIsMobileMenuOpen(false)}
            >{l.name}</Link>
          ))}
          <Link
            href="/contacto"
            style={{ fontSize: '1.2rem', fontWeight: 700, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.85)', textAlign: 'center', display: 'block' }}
            onClick={() => setIsMobileMenuOpen(false)}
          >Contacto</Link>
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px' }}>
            <Link
              href="/portal"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'white', color: '#0D0E15', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', maxWidth: '320px', margin: '0 auto', width: '100%' }}
            >
              <User size={20} /> Acceso Clientes
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'linear-gradient(to right, #D2F23A, #B89BFF)', color: '#0D0E15', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem', maxWidth: '320px', margin: '0 auto', width: '100%' }}
            >
              <Sparkles size={20} /> Acceso Equipo NEXA
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { NexaLogo };
