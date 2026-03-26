'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
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
          <div className="hidden lg:flex items-center ml-4">
            <Link href="/portal" className="nav-portal-btn flex items-center gap-2">
              <User className="nav-portal-icon" size={18} />
              <span>Área Clientes</span>
            </Link>
          </div>
        </div>
        <button className="mobile-toggle lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div 
        className="mobile-menu lg:hidden fixed top-[80px] left-0 w-full bg-nexa-dark border-b border-nexa-border overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: isMobileMenuOpen ? 'calc(100vh - 80px)' : '0', opacity: isMobileMenuOpen ? 1 : 0 }}
      >
        <div className="flex flex-col p-6 gap-6 h-full text-center">
          {links.map(l => (
            <Link key={l.name} href={l.path} className="text-xl font-bold hover:text-nexa-primary transition-colors py-4 border-b border-nexa-border" onClick={() => setIsMobileMenuOpen(false)}>{l.name}</Link>
          ))}
          <Link href="/contacto" className="text-xl font-bold hover:text-nexa-primary transition-colors py-4 border-b border-nexa-border" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
          <Link href="/portal" onClick={() => setIsMobileMenuOpen(false)} className="mt-6 flex items-center justify-center gap-2 bg-white text-nexa-dark py-4 rounded-xl font-bold text-lg mx-auto w-full max-w-[300px]">
            <User size={20} /> Entrar al Portal
          </Link>
        </div>
      </div>
    </nav>
  );
}

export { NexaLogo };
