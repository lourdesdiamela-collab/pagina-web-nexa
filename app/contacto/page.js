'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', service: '', challenge: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Error al enviar');
      setStatus('success');
      setFormData({ name: '', company: '', email: '', phone: '', service: '', challenge: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <div className="page-wrapper" style={{ paddingTop: 'clamp(100px, 12vw, 140px)' }}>
        <section className="contact-hero" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-tag">Contacto</span>
            <h1 className="section-title">Hablemos de tu <span className="text-gradient">marca.</span></h1>
            <p className="section-subtitle">Si estás listo para profesionalizar tu marketing, ordenar tu captura de leads y escalar tu negocio, dejá tus datos y nuestro equipo se comunicará con vos.</p>
          </div>
        </section>

        <section className="contact-form-section" style={{ paddingBottom: '120px' }}>
          <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit} className="contact-form-pro" style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: 'clamp(24px, 5vw, 50px)'
            }}>
              
              {status === 'success' && (
                <div style={{ background: 'rgba(40, 199, 111, 0.1)', color: '#28C76F', padding: '20px', borderRadius: '16px', marginBottom: '30px', fontWeight: 700, border: '1px solid rgba(40, 199, 111, 0.2)' }}>
                  ¡Mensaje enviado con éxito! Nos comunicaremos con vos a la brevedad.
                </div>
              )}

              {status === 'error' && (
                <div style={{ background: 'rgba(255, 107, 107, 0.1)', color: '#ff6b6b', padding: '20px', borderRadius: '16px', marginBottom: '30px', fontWeight: 700, border: '1px solid rgba(255, 107, 107, 0.2)' }}>
                  Ocurrió un error al enviar el mensaje. Podés contactarnos directo por WhatsApp.
                </div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label>Nombre y Apellido *</label>
                  <input type="text" placeholder="Ej: Juan Pérez" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required disabled={loading} />
                </div>
                <div className="form-field">
                  <label>Empresa / Negocio *</label>
                  <input type="text" placeholder="Nombre de tu marca" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required disabled={loading} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Email *</label>
                  <input type="email" placeholder="juan@empresa.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required disabled={loading} />
                </div>
                <div className="form-field">
                  <label>Teléfono / WhatsApp *</label>
                  <input type="tel" placeholder="+54 9 11 1234 5678" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required disabled={loading} />
                </div>
              </div>
              <div className="form-field">
                <label>Servicio de interés *</label>
                <select value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} required disabled={loading}>
                  <option value="" disabled>Seleccioná una opción...</option>
                  <option value="marketing_integral">Marketing & Estrategia Integral</option>
                  <option value="redes_sociales">Redes Sociales y Contenido</option>
                  <option value="meta_ads">Campañas Meta/Google Ads</option>
                  <option value="crm_estructuras">CRM y Orden Digital</option>
                  <option value="nexa_recover">NEXA Recover (Reactivación de bases)</option>
                </select>
              </div>
              <div className="form-field">
                <label>Desafío Principal</label>
                <textarea placeholder="Contanos brevemente qué te gustaría mejorar o qué objetivos tenés..." value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} disabled={loading}></textarea>
              </div>
              <button type="submit" className="btn-submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1, transition: 'opacity 0.3s' }}>
                {loading ? 'Enviando solicitud...' : 'Quiero potenciar mi negocio'}
              </button>
            </form>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
