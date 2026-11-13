'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Briefcase, X } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/quienes-somos', label: 'Quiénes somos' },
  { href: '/soluciones-ia', label: 'Kits IA' },
  { href: '/contacto', label: 'Contacto' },
];

function isLinkActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname?.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
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
        <nav className="nav-links-wrapper">
          <div className="nav-links-desktop">
            {LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <Link key={link.href} href={link.href} className={`nav-link ${active ? 'active' : ''}`}>
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-link-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="nav-link-label">{link.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="nav-cta-group">
            {/* Arrepentimiento, Baja e Ingresar a Aprende están en el pie (Footer.js). Arriba va solo el acceso al Portal NEXA. */}
            <a
              href="https://crm.nexagrowth.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-portal-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, border: '1.5px solid #6B3FD4', color: '#4B1FB0', background: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', whiteSpace: 'nowrap' }}
            >
              <Briefcase size={16} /> Portal NEXA
            </a>
          </div>
        </nav>

        {/* Botón de Menú Móvil */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {LINKS.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <Link key={link.href} href={link.href} className={`mobile-menu-link ${active ? 'active' : ''}`}>
                  {link.label}
                </Link>
              );
            })}
            <Link href="/arrepentimiento" className="mobile-menu-link">
              Botón de Arrepentimiento
            </Link>
            <Link href="/baja" className="mobile-menu-link">
              Botón de Baja de servicio
            </Link>
            <div className="mobile-menu-divider" />
            <Link href="https://crm.nexagrowth.com.ar" className="mobile-menu-link mobile-menu-link-ghost">
              <Briefcase size={16} /> Portal NEXA
              <span className="mobile-menu-link-hint">¿Ya sos cliente de NEXA? Ingresá acá</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
