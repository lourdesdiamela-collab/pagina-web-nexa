'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/clientes/dashboard')) {
    return null;
  }

  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 120, padding: scrolled ? '12px 0' : '18px 0', transition: 'all 0.25s ease', background: scrolled ? 'rgba(246,242,251,0.88)' : 'transparent', borderBottom: scrolled ? '1px solid rgba(16,18,34,0.1)' : 'none', backdropFilter: scrolled ? 'blur(10px)' : 'none' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <NexaLogo size={34} />
        </Link>

        <nav className="nexa-top-nav" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="nexa-top-links" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: '#1d2134', fontWeight: 600, padding: '8px 10px', borderRadius: 10 }}>
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="https://nexa-roan-theta.vercel.app" style={{ textDecoration: 'none', borderRadius: 999, border: '1px solid rgba(184,155,255,0.5)', background: 'rgba(184,155,255,0.15)', color: '#4f2cb4', padding: '8px 12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <UserRound size={14} /> Equipo NEXA y clientes
          </Link>
        </nav>

        <button
          type="button"
          className="nexa-mobile-toggle"
          onClick={() => setIsOpen((value) => !value)}
          style={{ borderRadius: 10, border: '1px solid rgba(16,18,34,0.2)', background: 'white', color: '#111426', padding: 8 }}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {isOpen && (
        <div style={{ borderTop: '1px solid rgba(16,18,34,0.1)', background: 'white' }}>
          <div className="container" style={{ padding: '10px 0', display: 'grid', gap: 6 }}>
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} style={{ textDecoration: 'none', color: '#1d2134', fontWeight: 600, padding: '10px 4px' }}>
                {link.label}
              </Link>
            ))}
            <Link href="https://nexa-roan-theta.vercel.app" style={{ textDecoration: 'none', color: '#4f2cb4', fontWeight: 700, padding: '10px 4px' }}>
              Equipo NEXA y clientes
            </Link>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .nexa-mobile-toggle { display: none; }
