'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckSquare, Plus, RefreshCw, Trash2 } from 'lucide-react';

const INITIAL_FORM = {
  clientId: '',
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(INITIAL_FORM);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksRes, clientsRes] = await Promise.all([
        fetch('/api/admin/tareas', { cache: 'no-store' }),
        fetch('/api/admin/clientes', { cache: 'no-store' }),
      ]);
      const [tasksPayload, clientsPayload] = await Promise.all([tasksRes.json(), clientsRes.json()]);
      if (!tasksRes.ok) throw new Error(tasksPayload.error || 'No se pudo cargar tareas');
      if (!clientsRes.ok) throw new Error(clientsPayload.error || 'No se pudo cargar clientes');
      setTasks(tasksPayload.tasks || []);
      setClients(clientsPayload.clients || []);
      if (!form.clientId && clientsPayload.clients?.[0]?.id) {
        setForm((prev) => ({ ...prev, clientId: clientsPayload.clients[0].id }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // load intentionally runs once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => statusFilter === 'all' || task.status === statusFilter);
  }, [tasks, statusFilter]);

  const createTask = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo crear tarea');
      setForm((prev) => ({ ...INITIAL_FORM, clientId: prev.clientId }));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (task, status) => {
    try {
      const response = await fetch('/api/admin/tareas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo actualizar');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeTask = async (taskId) => {
    const ok = window.confirm('¿Eliminar esta tarea?');
    if (!ok) return;
    try {
      const response = await fetch(`/api/admin/tareas?id=${taskId}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckSquare size={22} color="#D2F23A" /> Tareas
          </h2>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Crea, edita y sincroniza tareas con Trello desde el CRM.</p>
        </div>
        <button type="button" onClick={load} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 12px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={16} /> Recargar
        </button>
      </header>

      {error && (
        <div style={{ marginBottom: 12, borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,107,107,0.45)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8' }}>
          {error}
        </div>
      )}

      <article style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Nueva tarea</h3>
        <form onSubmit={createTask} style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 8 }}>
            <select required value={form.clientId} onChange={(event) => setForm((prev) => ({ ...prev, clientId: event.target.value }))} style={inputStyle}>
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.company}</option>
              ))}
            </select>
            <input required value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Titulo" style={inputStyle} />
          </div>
          <textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Descripcion" style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
            <select value={form.priority} onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))} style={inputStyle}>
              <option value="low">Prioridad baja</option>
              <option value="medium">Prioridad media</option>
              <option value="high">Prioridad alta</option>
            </select>
            <input type="date" value={form.dueDate} onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))} style={inputStyle} />
            <button type="submit" disabled={saving} style={actionButtonStyle}>
              <Plus size={14} /> {saving ? 'Guardando...' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </article>

      <section style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={inputStyle}>
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in_progress">En curso</option>
          <option value="review">Revision</option>
          <option value="completed">Completada</option>
        </select>
      </section>

      <article style={panelStyle}>
        <h3 style={{ marginTop: 0 }}>Listado</h3>
        {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando...</p>}
        {!loading && visibleTasks.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay tareas para este filtro.</p>}
        {!loading && visibleTasks.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Tarea</th>
                  <th style={{ padding: 8 }}>Cliente</th>
                  <th style={{ padding: 8 }}>Prioridad</th>
                  <th style={{ padding: 8 }}>Vence</th>
                  <th style={{ padding: 8 }}>Estado</th>
                  <th style={{ padding: 8, textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((task) => (
                  <tr key={task.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: 8 }}>
                      <strong>{task.title}</strong>
                      <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.86rem' }}>{task.description || 'Sin descripcion'}</div>
                    </td>
                    <td style={{ padding: 8 }}>{task.clientName || '-'}</td>
                    <td style={{ padding: 8 }}>{task.priority}</td>
                    <td style={{ padding: 8 }}>{task.due_date ? new Date(task.due_date).toLocaleDateString('es-AR') : '-'}</td>
                    <td style={{ padding: 8 }}>
                      <select value={task.status} onChange={(event) => updateStatus(task, event.target.value)} style={inputStyle}>
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En curso</option>
                        <option value="review">Revision</option>
                        <option value="completed">Completada</option>
                      </select>
                    </td>
                    <td style={{ padding: 8, textAlign: 'right' }}>
                      <button type="button" onClick={() => removeTask(task.id)} style={dangerButtonStyle}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}

const panelStyle = {
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  padding: 14,
};

const inputStyle = {
  width: '100%',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.03)',
  color: 'white',
  padding: '8px 10px',
};

const actionButtonStyle = {
  borderRadius: 10,
  border: '1px solid rgba(210,242,58,0.35)',
  background: 'rgba(210,242,58,0.15)',
  color: '#f3ffb5',
  padding: '8px 12px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontWeight: 700,
};

const dangerButtonStyle = {
  borderRadius: 10,
  border: '1px solid rgba(255,107,107,0.45)',
  background: 'rgba(255,107,107,0.15)',
  color: '#ffd8d8',
  padding: 7,
};
