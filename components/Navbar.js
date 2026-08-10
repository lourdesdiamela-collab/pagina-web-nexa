'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, UserRound, Briefcase, X } from 'lucide-react';
import { NexaLogo } from './NexaLogo';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/casos', label: 'Casos' },
  { href: '/aprende', label: 'Aprende' },
  { href: '/contacto', label: 'Contacto' },
];

function isLinkActive(pathname, href) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname?.startsWith(`${href}/`);
}

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
    : 'Ingresar a Aprende';

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
            <Link href={accountHref} className="nav-portal">
              <UserRound size={14} /> {accountLabel}
            </Link>
            <Link
              href="https://crm.nexagrowth.com.ar"
              className="nav-portal nav-portal-crm"
              title="Acceso exclusivo para clientes de NEXA con servicios activos"
            >
              <Briefcase size={13} /> Portal de Clientes
            </Link>
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
            <div className="mobile-menu-divider" />
            <Link href={accountHref} className="mobile-menu-link mobile-menu-link-accent">
              <UserRound size={16} /> {accountLabel}
            </Link>
            <Link href="https://crm.nexagrowth.com.ar" className="mobile-menu-link mobile-menu-link-ghost">
              <Briefcase size={16} /> Portal de Clientes
              <span className="mobile-menu-link-hint">¿Ya sos cliente de NEXA? Ingresá acá</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
