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
              <span>Dueños</span>
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
          <div className="mt-8 flex flex-col gap-4">
            <Link href="/portal" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-white text-nexa-dark py-4 rounded-xl font-bold text-lg mx-auto w-full max-w-[300px]">
              <User size={20} /> Acceso Clientes
            </Link>
            <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D2F23A] to-[#B89BFF] text-black py-4 rounded-xl font-bold text-lg mx-auto w-full max-w-[300px]">
              <Sparkles size={20} /> Acceso Dueños
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { NexaLogo };
