'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ExternalLink } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <header className="nexa-nav" data-scrolled={scrolled}>
      <div className="container nexa-nav-inner">
        <Link href="/" aria-label="NEXA Inicio">
          <NexaLogo size={32} />
        </Link>

        {/* Desktop Links */}
        <nav className="nexa-nav-links" aria-label="Navegación principal">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nexa-nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://crm.nexagrowth.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="nexa-nav-cta"
          >
            <ExternalLink size={14} /> NEXA OS
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="nexa-nav-toggle"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="nexa-mobile-menu" role="navigation" aria-label="Menú móvil">
          <div className="container">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nexa-mobile-link">
                {link.label}
              </Link>
            ))}
            <a
              href="https://crm.nexagrowth.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="nexa-mobile-link nexa-mobile-cta"
            >
              <ExternalLink size={14} /> Ingresar a NEXA OS
            </a>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .nexa-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 120;
          padding: 20px 0;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nexa-nav[data-scrolled="true"] {
          padding: 12px 0;
          background: rgba(250, 248, 252, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(184, 155, 255, 0.15);
          box-shadow: 0 4px 24px rgba(184, 155, 255, 0.06);
        }
        .nexa-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
        }
        .nexa-nav-links {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.55);
          padding: 6px 8px 6px 24px;
          border-radius: 100px;
          border: 1px solid rgba(184, 155, 255, 0.18);
          backdrop-filter: blur(8px);
        }
        .nexa-nav-link {
          font-size: 0.88rem; font-weight: 600; color: #505466;
          padding: 8px 12px; border-radius: 100px;
          transition: color 0.3s, background 0.3s;
        }
        .nexa-nav-link:hover, .nexa-nav-link.active {
          color: #835CE6;
        }
        .nexa-nav-cta {
          display: inline-flex; align-items: center; gap: 6px;
          background: #0D0E15; color: white;
          padding: 10px 20px; border-radius: 100px;
          font-weight: 700; font-size: 0.82rem;
          letter-spacing: 0.04em; text-transform: uppercase;
          transition: all 0.3s;
        }
        .nexa-nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(13,14,21,0.2);
        }
        .nexa-nav-toggle {
          display: none; padding: 8px;
          border-radius: 10px; border: 1px solid rgba(18,20,29,0.15);
          background: white; color: #12141D;
          transition: transform 0.2s;
        }
        .nexa-nav-toggle:hover { transform: scale(1.05); }

        /* Mobile */
        @media (max-width: 900px) {
          .nexa-nav-links { display: none; }
          .nexa-nav-toggle { display: flex; align-items: center; justify-content: center; }
        }
        .nexa-mobile-menu {
          border-top: 1px solid rgba(18,20,29,0.08);
          background: white;
          padding: 16px 0 24px;
          animation: slideDown 0.3s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nexa-mobile-menu .container {
          display: flex; flex-direction: column; gap: 4px;
        }
        .nexa-mobile-link {
          display: flex; align-items: center; gap: 8px;
          padding: 14px 12px; border-radius: 12px;
          font-weight: 600; color: #12141D; font-size: 1rem;
          transition: background 0.2s;
        }
        .nexa-mobile-link:hover { background: rgba(184,155,255,0.08); }
        .nexa-mobile-cta {
          color: #835CE6; font-weight: 700;
          margin-top: 8px; padding-top: 16px;
          border-top: 1px solid rgba(18,20,29,0.08);
        }
        @media (min-width: 901px) {
          .nexa-mobile-menu { display: none; }
        }
      `}} />
    </header>
  );
}