'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Edit3, Plus, Search, Trash2, UserRound, X } from 'lucide-react';

const INITIAL_FORM = {
  id: '',
  company: '',
  contact_name: '',
  email: '',
  password: '',
  plan: 'Growth',
  service: 'Marketing Integral',
  status: 'active',
  serviceMode: 'fixed',
  startDate: '',
  endDate: '',
  durationDays: '',
  category: '',
  responsible: '',
  notes: '',
};

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/clientes', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo cargar');
      setClients(payload.clients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (statusFilter !== 'all' && client.status !== statusFilter) return false;
      if (!search) return true;
      const haystack = `${client.company} ${client.contact_name} ${client.email}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [clients, search, statusFilter]);

  const openCreate = () => {
    setForm(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (client) => {
    setForm({
      id: client.id,
      company: client.company || '',
      contact_name: client.contact_name || '',
      email: client.email || '',
      password: '',
      plan: client.plan || 'Growth',
      service: client.service || 'Marketing Integral',
      status: client.status || 'active',
      serviceMode: client.serviceMode || 'fixed',
      startDate: client.startDate ? client.startDate.slice(0, 10) : '',
      endDate: client.endDate ? client.endDate.slice(0, 10) : '',
      durationDays: client.durationDays || '',
      category: client.category || '',
      responsible: client.responsible || '',
      notes: client.notes || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setForm(INITIAL_FORM);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const isEdit = Boolean(form.id);
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/clientes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          durationDays: form.durationDays ? Number(form.durationDays) : null,
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo guardar');

      await fetchClients();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeClient = async (id) => {
    const confirmed = window.confirm('Esta accion eliminara el cliente del CRM y desactivara su acceso. ¿Continuar?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/clientes?id=${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar');
      await fetchClients();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserRound size={22} color="#D2F23A" /> Clientes
          </h2>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Alta, edicion, seguimiento y acceso a detalle operativo.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 12, border: '1px solid rgba(210,242,58,0.35)', background: 'rgba(210,242,58,0.12)', color: '#F3FFB5', padding: '10px 14px', fontWeight: 700 }}
        >
          <Plus size={16} /> Nuevo cliente
        </button>
      </header>

      <section style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <label style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: 'rgba(255,255,255,0.4)' }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por empresa, contacto o email"
            style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: 'white' }}
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          style={{ padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.04)', color: 'white', minWidth: 180 }}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="paused">En pausa</option>
          <option value="inactive">Inactivos</option>
        </select>
      </section>

      {error && (
        <div style={{ marginBottom: 12, borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,107,107,0.4)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8' }}>
          {error}
        </div>
      )}

      <article style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', overflow: 'hidden', background: 'rgba(13,14,21,0.56)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
              <th style={{ padding: 12 }}>Cliente</th>
              <th style={{ padding: 12 }}>Plan y modalidad</th>
              <th style={{ padding: 12 }}>Seguimiento</th>
              <th style={{ padding: 12 }}>Pendientes</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ padding: 20, color: 'rgba(255,255,255,0.6)' }}>Cargando clientes...</td>
              </tr>
            )}
            {!loading && filteredClients.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 20, color: 'rgba(255,255,255,0.6)' }}>No hay resultados para ese filtro.</td>
              </tr>
            )}
            {!loading && filteredClients.map((client) => (
              <tr key={client.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <td style={{ padding: 12 }}>
                  <strong style={{ display: 'block' }}>{client.company}</strong>
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.86rem' }}>{client.contact_name || client.email}</span>
                </td>
                <td style={{ padding: 12 }}>
                  <div>{client.plan}</div>
                  <small style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {client.serviceMode === 'temporary' ? `Temporal (${client.durationDays || '-'} dias)` : 'Cliente fijo'}
                  </small>
                </td>
                <td style={{ padding: 12 }}>
                  <div>{client.openFollowups || 0} abiertos</div>
                  <small style={{ color: 'rgba(255,255,255,0.65)' }}>{client.pendingTasks || 0} tareas activas</small>
                </td>
                <td style={{ padding: 12 }}>
                  <strong>{formatMoney(client.pendingPaymentsAmount)}</strong>
                  <div style={{ fontSize: '0.82rem', color: client.status === 'active' ? '#7ef0b3' : '#ffb97a' }}>
                    {client.status}
                  </div>
                </td>
                <td style={{ padding: 12, textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 8 }}>
                    <Link href={`/admin/clientes/${client.id}`} style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', padding: '7px 10px', color: 'white', textDecoration: 'none', fontSize: '0.86rem' }}>
                      Abrir
                    </Link>
                    <button type="button" onClick={() => openEdit(client)} style={{ borderRadius: 10, border: '1px solid rgba(184,155,255,0.45)', background: 'rgba(184,155,255,0.16)', color: 'white', padding: '7px 10px' }}>
                      <Edit3 size={14} />
                    </button>
                    <button type="button" onClick={() => removeClient(client.id)} style={{ borderRadius: 10, border: '1px solid rgba(255,107,107,0.5)', background: 'rgba(255,107,107,0.15)', color: '#ffd8d8', padding: '7px 10px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.68)', display: 'grid', placeItems: 'center', zIndex: 30, padding: 20 }}>
          <div style={{ width: 'min(900px, 100%)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.13)', background: '#111625', padding: 18, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>{form.id ? 'Editar cliente' : 'Nuevo cliente'}</h3>
              <button type="button" onClick={closeModal} style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: 8 }}><X size={16} /></button>
            </div>

            <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input required value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} placeholder="Empresa" style={inputStyle} />
                <input required value={form.contact_name} onChange={(event) => setForm((prev) => ({ ...prev, contact_name: event.target.value }))} placeholder="Contacto" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input required type="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="Email de acceso" style={inputStyle} />
                <input type="text" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder={form.id ? 'Nueva password (opcional)' : 'Password inicial'} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <input value={form.plan} onChange={(event) => setForm((prev) => ({ ...prev, plan: event.target.value }))} placeholder="Plan" style={inputStyle} />
                <input value={form.service} onChange={(event) => setForm((prev) => ({ ...prev, service: event.target.value }))} placeholder="Servicio" style={inputStyle} />
                <select value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} style={inputStyle}>
                  <option value="active">Activo</option>
                  <option value="paused">Pausado</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <input type="date" value={form.startDate} onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))} style={inputStyle} />
                <select value={form.serviceMode} onChange={(event) => setForm((prev) => ({ ...prev, serviceMode: event.target.value }))} style={inputStyle}>
                  <option value="fixed">Cliente fijo</option>
                  <option value="temporary">Duracion determinada</option>
                </select>
                <input type="number" min={1} disabled={form.serviceMode !== 'temporary'} value={form.durationDays} onChange={(event) => setForm((prev) => ({ ...prev, durationDays: event.target.value }))} placeholder="Duracion en dias" style={{ ...inputStyle, opacity: form.serviceMode !== 'temporary' ? 0.6 : 1 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <input type="date" value={form.endDate} onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))} style={inputStyle} />
                <input value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} placeholder="Categoria cliente" style={inputStyle} />
                <input value={form.responsible} onChange={(event) => setForm((prev) => ({ ...prev, responsible: event.target.value }))} placeholder="Responsable" style={inputStyle} />
              </div>
              <textarea value={form.notes} onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Notas internas" style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" onClick={closeModal} style={ghostButton}>Cancelar</button>
                <button type="submit" disabled={saving} style={primaryButton}>{saving ? 'Guardando...' : 'Guardar cliente'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.04)',
  color: 'white',
  padding: '10px 12px',
};

const primaryButton = {
  borderRadius: 12,
  border: '1px solid rgba(210,242,58,0.38)',
  background: 'rgba(210,242,58,0.17)',
  color: '#f3ffb5',
  padding: '10px 14px',
  fontWeight: 700,
};

const ghostButton = {
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'transparent',
  color: 'white',
  padding: '10px 14px',
  fontWeight: 700,
};
