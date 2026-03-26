'use client';
import { useState, useEffect } from 'react';
import { Plus, Users, Loader2 } from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Client Form
  const [form, setForm] = useState({ company: '', contact_name: '', email: '', password: '', plan: 'Growth', service: 'Marketing Integral' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchClients = async () => {
    try {
      // In a real app we would call a GET /api/admin/clientes
      // For this demo, let's just show a static list or fetch from an endpoint.
      // I'll create a quick GET endpoint below.
      const res = await fetch('/api/admin/clientes');
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      console.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch('/api/admin/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error);
        setSaving(false);
        return;
      }

      setShowModal(false);
      setForm({ company: '', contact_name: '', email: '', password: '', plan: 'Growth', service: 'Marketing Integral' });
      fetchClients();
    } catch {
      setError('Error al crear el cliente');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: '#12141D', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users color="#B89BFF" /> Gestión de Clientes
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', marginTop: '8px' }}>
            Base de datos de clientes y accesos al Área Clientes.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          background: '#12141D', color: 'white', padding: '12px 24px', borderRadius: '12px',
          fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(18,20,29,0.1)'
        }}>
          <Plus size={18} /> Nuevo Cliente
        </button>
      </header>

      <div style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}><Loader2 className="spinner" size={32} /></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9F9F9', borderBottom: '1px solid #EEE', textAlign: 'left' }}>
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Empresa / Cliente</th>
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Email (Login)</th>
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Plan</th>
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #EEE' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 800, color: '#12141D' }}>{c.company}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{c.contact_name}</div>
                  </td>
                  <td style={{ padding: '20px', color: '#444', fontWeight: 500 }}>{c.email}</td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ background: 'rgba(184, 155, 255, 0.1)', color: '#6A35FF', padding: '6px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {c.plan}
                    </span>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ color: c.status === 'active' ? '#28C76F' : '#FF9F43', fontWeight: 700, fontSize: '0.9rem' }}>
                      {c.status === 'active' ? 'Activo' : c.status}
                    </span>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay clientes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', padding: '40px', position: 'relative' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#12141D', marginBottom: '24px' }}>Registrar Nuevo Cliente</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && <div style={{ background: 'rgba(211,47,47,0.1)', color: '#d32f2f', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#12141D', marginBottom: '8px' }}>Empresa / Marca *</label>
                <input required type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#12141D', marginBottom: '8px' }}>Nombre del Contacto</label>
                <input type="text" value={form.contact_name} onChange={e => setForm({...form, contact_name: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#12141D', marginBottom: '8px' }}>Email (Usuario para acceder) *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#12141D', marginBottom: '8px' }}>Contraseña de acceso *</label>
                <input required type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Ej: NexaBrand2026!" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E5E5', background: '#F9F9F9' }} />
                <span style={{ fontSize: '0.75rem', color: '#999', marginTop: '6px', display: 'block' }}>Pasale esta contraseña al cliente para que pueda ingresar.</span>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', background: '#F5F5F5', color: '#666', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '16px', background: '#12141D', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Guardando...' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
      `}} />
    </div>
  );
}
