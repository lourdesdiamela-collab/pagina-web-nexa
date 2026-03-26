'use client';
import { useState, useEffect } from 'react';
import { Plus, Users, Loader2 } from 'lucide-react';

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ company: '', contact_name: '', email: '', password: '', plan: 'Growth', service: 'Marketing Integral', category: 'Inmobiliaria' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState(null);

  const fetchClients = async () => {
    try {
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
      const isEditing = !!editingClient;
      const url = '/api/admin/clientes';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? { ...form, id: editingClient.id } : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error);
        setSaving(false);
        return;
      }

      setShowModal(false);
      setEditingClient(null);
      setForm({ company: '', contact_name: '', email: '', password: '', plan: 'Growth', service: 'Marketing Integral', category: 'Inmobiliaria' });
      fetchClients();
    } catch {
      setError('Error al procesar el cliente');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este cliente? Se perderá el acceso a la plataforma.')) return;
    try {
      const res = await fetch(`/api/admin/clientes?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchClients();
    } catch {
      alert('Error al eliminar');
    }
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setForm({
      company: client.company,
      contact_name: client.contact_name,
      email: client.email || '',
      password: '', 
      plan: client.plan || 'Growth',
      service: client.service || 'Marketing Integral',
      category: client.category || 'Varios'
    });
    setShowModal(true);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: '#12141D', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Users color="#B89BFF" /> Gestión de Clientes
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', marginTop: '8px' }}>
            Base de datos y control de accesos. Definí planes y categorías.
          </p>
        </div>
        <button onClick={() => { setEditingClient(null); setShowModal(true); }} style={{
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
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Plan & Categoría</th>
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Estado</th>
                <th style={{ padding: '20px', color: '#999', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #EEE' }}>
                  <td style={{ padding: '20px' }}>
                    <div style={{ fontWeight: 800, color: '#12141D' }}>{c.company}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: 'rgba(184, 155, 255, 0.1)', color: '#6A35FF', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>{c.plan}</span>
                      <span style={{ background: '#F0F0F0', color: '#666', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>{c.category || 'General'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px' }}>
                    <span style={{ color: c.status === 'active' ? '#28C76F' : '#FF9F43', fontWeight: 800, fontSize: '0.85rem' }}>
                      {c.status === 'active' ? '● ACTIVO' : '● ' + c.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(c)} style={{ background: '#F5F5F7', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => handleDelete(c.id)} style={{ background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '550px', padding: '40px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#12141D', marginBottom: '24px' }}>{editingClient ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && <div style={{ background: 'rgba(211,47,47,0.1)', color: '#d32f2f', padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Marca *</label>
                  <input required type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #EEE', background: '#F9F9F9' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Categoría</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #EEE', background: '#F9F9F9' }}>
                    {['Inmobiliaria', 'Motos', 'Salud/Estética', 'SaaS', 'E-commerce', 'Varios'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Email de Acceso *</label>
                <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={!!editingClient} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #EEE', background: editingClient ? '#EEE' : '#F9F9F9', opacity: editingClient ? 0.6 : 1 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Plan Contratado</label>
                  <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #EEE', background: '#F9F9F9' }}>
                    {['Growth', 'Performance', 'Elite', 'Starter'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>Password</label>
                   <input type="text" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder={editingClient ? 'Nueva para cambiar' : 'Password inicial'} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #EEE', background: '#F9F9F9' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '18px', background: '#F5F5F7', color: '#12141D', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '18px', background: '#12141D', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  {saving ? 'Guardando...' : (editingClient ? 'Actualizar' : 'Crear Acceso')}
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
