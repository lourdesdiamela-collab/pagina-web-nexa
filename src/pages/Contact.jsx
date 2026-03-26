import React, { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const CRM_WEBHOOK_URL = 'https://nexa-crm.api/webhook/leads';
    try {
      await fetch(CRM_WEBHOOK_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "Página Contacto Premium", ...form })
      }).catch(() => console.log('CRM fallback'));
      setSubmitted(true);
    } catch {
      alert("Error.");
    }
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span className="section-tag">Contacto</span>
          <h1 className="section-title">Hablemos de tu <span className="text-gradient">marca</span></h1>
          <p className="section-subtitle">Completá el formulario y coordinamos una primera conversación para conocer tu negocio, entender qué necesitás y ver cómo podemos ayudarte a crecer con una estrategia más clara.</p>
        </div>
        
        {submitted ? (
          <div className="success-message" style={{ background: 'rgba(210, 242, 58, 0.1)', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(210, 242, 58, 0.3)' }}>
            <h3 style={{ color: 'var(--lima)', fontSize: '1.8rem', marginBottom: '10px' }}>¡Mensaje recibido!</h3>
            <p style={{ color: 'white' }}>Nuestro equipo va a revisar tu perfil y te contactaremos dentro de 24hs hábiles para coordinar la charla.</p>
          </div>
        ) : (
          <form className="contact-form-pro" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Nombre y Apellido</label>
                <input type="text" name="name" required onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Email profesional</label>
                <input type="email" name="email" required onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>WhatsApp / Teléfono</label>
                <input type="tel" name="phone" onChange={handleChange} />
              </div>
              <div className="form-field">
                <label>Empresa / Negocio</label>
                <input type="text" name="company" required onChange={handleChange} />
              </div>
            </div>
            <div className="form-field">
              <label>¿Qué servicio te interesa?</label>
              <select name="service" required onChange={handleChange} defaultValue="">
                <option value="" disabled>Elegir opción estratégica...</option>
                <option>Marketing y Estrategia</option>
                <option>Redes Sociales y Contenido</option>
                <option>Campañas y Captación</option>
                <option>CRM y Seguimiento</option>
                <option>Orden Digital y Estructura</option>
                <option>NEXA Recover</option>
                <option>Todavía no sé / Necesito orientación</option>
              </select>
            </div>
            <div className="form-field">
              <label>Contanos un poco más sobre tu negocio y tu desafío actual</label>
              <textarea name="message" rows="5" required onChange={handleChange} placeholder="Ej: Queremos mejorar el diseño de Instagram y lanzar campañas porque dependemos mucho del boca a boca..."></textarea>
            </div>
            <button type="submit" className="btn-submit" style={{ marginTop: '20px' }}>
              Quiero hablar con NEXA →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
