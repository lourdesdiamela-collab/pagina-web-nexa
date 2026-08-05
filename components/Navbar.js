'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Menu, UserRound, X } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos', label: 'Casos' },
  { href: '/aprende', label: 'Aprende' },
  { href: '/contacto', label: 'Contacto' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const accountHref = session?.user
    ? (session.user.role === 'ADMIN' ? '/aprende/admin' : '/aprende/mis-recursos')
    : '/aprende/cuenta/login';
  const accountLabel = session?.user
    ? (session.user.role === 'ADMIN' ? 'Panel admin' : 'Mis recursos')
    : 'Ingresar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Si estamos dentro del panel de administración o cliente, no renderizar la Navbar pública
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/clientes/dashboard')) {
    return null;
  }

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link href="/" className="nav-logo">
          <NexaLogo size={34} />
        </Link>

        {/* Menú de Escritorio */}
        <nav className="nav-links-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                style={{
                  color: '#1d2134',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  transition: 'color 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link href={accountHref} className="nav-portal">
            <UserRound size={14} /> {accountLabel}
          </Link>
          <Link href="https://crm.nexagrowth.com.ar" className="nav-portal">
            <UserRound size={14} /> Ingresar al CRM
          </Link>
        </nav>

        {/* Botón de Menú Móvil */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ display: 'none', cursor: 'pointer', zIndex: 110 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {isOpen && (
        <div
          className="mobile-menu"
          style={{
            position: 'fixed',
            top: '80px',
            left: 0,
            right: 0,
            background: 'white',
            borderBottom: '1px solid rgba(16, 18, 34, 0.1)',
            padding: '24px',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          }}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: '#1d2134',
                fontWeight: 700,
                fontSize: '1.1rem',
                padding: '8px 0',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            style={{
              color: '#835CE6',
              fontWeight: 800,
              fontSize: '1.1rem',
              padding: '12px 0',
              borderTop: '1px solid rgba(16,18,34,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <UserRound size={16} /> {accountLabel}
          </Link>
          <Link
            href="https://crm.nexagrowth.com.ar"
            style={{
              color: '#835CE6',
              fontWeight: 800,
              fontSize: '1.1rem',
              padding: '4px 0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <UserRound size={16} /> Ingresar al CRM
          </Link>
        </div>
      )}

      {/* Estilos responsivos locales para Navbar */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .nav-links-desktop {
            display: none !important;
          }
          .nav-links-wrapper {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}
