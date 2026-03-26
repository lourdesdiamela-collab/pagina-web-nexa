import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import NexaLogo from './NexaLogo';

// CRM Portal URL — update this when the production CRM is ready
const CRM_PORTAL_URL = 'https://nexa-crm.vercel.app';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Casos', path: '/casos' },
    { name: 'Aprende con NEXA', path: '/aprende' },
  ];

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <Link to="/" className="nav-logo" onClick={() => window.scrollTo(0,0)}>
          <NexaLogo />
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <Link 
              key={l.name} 
              to={l.path} 
              className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
            >
              {l.name}
            </Link>
          ))}
          <a
            href={CRM_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-portal"
          >
            <LogIn size={16} /> Acceso Clientes
          </a>
          <Link to="/contacto" className="nav-cta">Hablemos de tu marca</Link>
        </div>
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              position: 'absolute', top: '100%', left: 24, right: 24,
              background: '#fff', borderRadius: 24, padding: 32,
              border: '1px solid rgba(184, 155, 255, 0.25)',
              boxShadow: '0 24px 80px rgba(13, 14, 21, 0.15)',
              display: 'flex', flexDirection: 'column', gap: 20
            }}
          >
            {links.map(l => (
              <Link 
                key={l.name} 
                to={l.path}
                style={{ fontSize: '1.2rem', fontWeight: 800, color: location.pathname === l.path ? '#B89BFF' : '#12141D' }}
              >
                {l.name}
              </Link>
            ))}
            <a
              href={CRM_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B89BFF', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LogIn size={18} /> Acceso Clientes
            </a>
            <Link to="/contacto" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              Hablemos de tu marca
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
