import React from 'react';
import { Instagram, Linkedin, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import NexaLogo from './NexaLogo';

// CRM Portal URL — update this when the production CRM is ready
const CRM_PORTAL_URL = 'https://nexa-crm.vercel.app';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-inner">
        <div className="footer-logo">
          <Link to="/" onClick={() => window.scrollTo(0,0)}><NexaLogo size={32} /></Link>
        </div>
        <div className="footer-links">
          <Link to="/servicios" onClick={() => window.scrollTo(0,0)}>Servicios</Link>
          <Link to="/casos" onClick={() => window.scrollTo(0,0)}>Casos de Éxito</Link>
          <Link to="/aprende" onClick={() => window.scrollTo(0,0)}>Aprende con NEXA</Link>
          <Link to="/contacto" onClick={() => window.scrollTo(0,0)} style={{ color: '#B89BFF' }}>Hablemos de tu marca</Link>
          <a href={CRM_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="footer-portal-link">
            <LogIn size={14} /> Portal CRM
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NEXA STRATEGY. LAB DIGITAL ESTRATÉGICO.</span>
        <div className="social-links-pro">
          <a href="https://instagram.com/nexagrowth.ar" target="_blank" rel="noreferrer" className="social-badge">
            <Instagram size={16} /> @nexagrowth.ar
          </a>
          <a href="https://instagram.com/somosnexa.ar" target="_blank" rel="noreferrer" className="social-badge">
            <Instagram size={16} /> @somosnexa.ar
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-badge icon-only">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
