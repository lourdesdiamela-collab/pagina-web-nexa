'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, CalendarClock, CheckCircle2, CircleDollarSign, Plus, Save, Trash2 } from 'lucide-react';

function money(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [paymentForm, setPaymentForm] = useState({ concept: '', amount: '', dueDate: '', status: 'pending', method: 'transferencia', notes: '' });
  const [followupForm, setFollowupForm] = useState({ comment: '', nextStep: '', reminderAt: '', status: 'abierto' });

  const load = async () => {
    if (!clientId) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/clientes/${clientId}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo cargar cliente');
      setData(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // clientId is already consumed inside load and this page is route-bound
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const pendingAmount = useMemo(() => {
    if (!data?.payments) return 0;
    return data.payments
      .filter((payment) => ['pending', 'overdue'].includes(payment.status))
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }, [data]);

  const createTask = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/admin/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate,
          status: 'pending',
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo crear tarea');
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateTaskStatus = async (task, status) => {
    try {
      const response = await fetch('/api/admin/tareas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo actualizar tarea');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (taskId) => {
    const ok = window.confirm('¿Eliminar esta tarea?');
    if (!ok) return;
    try {
      const response = await fetch(`/api/admin/tareas?id=${taskId}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar tarea');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const createPayment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/admin/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentForm,
          clientId,
          amount: Number(paymentForm.amount),
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo registrar pago');
      setPaymentForm({ concept: '', amount: '', dueDate: '', status: 'pending', method: 'transferencia', notes: '' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePayment = async (paymentId) => {
    const ok = window.confirm('¿Eliminar este pago?');
    if (!ok) return;
    try {
      const response = await fetch(`/api/admin/pagos?id=${paymentId}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar pago');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const createFollowup = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/admin/seguimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...followupForm,
          clientId,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo guardar seguimiento');
      setFollowupForm({ comment: '', nextStep: '', reminderAt: '', status: 'abierto' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteFollowup = async (followupId) => {
    const ok = window.confirm('¿Eliminar esta entrada de seguimiento?');
    if (!ok) return;
    try {
      const response = await fetch(`/api/admin/seguimientos?id=${followupId}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar seguimiento');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p style={{ color: 'rgba(255,255,255,0.7)' }}>Cargando detalle de cliente...</p>;
  }

  if (!data?.client) {
    return (
      <div>
        <p style={{ color: '#ffd8d8' }}>{error || 'No encontramos este cliente.'}</p>
        <Link href="/admin/clientes" style={{ color: '#B89BFF' }}>Volver a clientes</Link>
      </div>
    );
  }

  const { client, tasks, payments, followups, deliveries } = data;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div>
          <Link href="/admin/clientes" style={{ color: '#B89BFF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <ArrowLeft size={14} /> Volver
          </Link>
          <h2 style={{ margin: 0, fontSize: '1.9rem' }}>{client.company}</h2>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>
            {client.contact_name} · {client.email}
          </p>
        </div>
        <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', padding: 12, minWidth: 230 }}>
          <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.64)' }}>Estado del servicio</div>
          <strong style={{ display: 'block', marginTop: 4 }}>{client.status}</strong>
          <small style={{ color: 'rgba(255,255,255,0.6)' }}>
            {client.serviceMode === 'temporary'
              ? `Temporal (${client.durationDays || '-'} dias)`
              : 'Cliente fijo'}
          </small>
        </div>
      </header>

      {error && (
        <div style={{ borderRadius: 12, border: '1px solid rgba(255,107,107,0.35)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8', padding: '10px 12px' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Tareas abiertas</div>
          <strong style={cardValueStyle}>{tasks.filter((task) => task.status !== 'completed').length}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Seguimientos abiertos</div>
          <strong style={cardValueStyle}>{followups.filter((item) => item.status !== 'cerrado').length}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Pagos pendientes</div>
          <strong style={cardValueStyle}>{money(pendingAmount)}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Entregables</div>
          <strong style={cardValueStyle}>{deliveries.length}</strong>
        </article>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
        <article style={panelStyle}>
          <h3 style={panelTitleStyle}>Tareas</h3>
          <form onSubmit={createTask} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            <input value={taskForm.title} onChange={(event) => setTaskForm((prev) => ({ ...prev, title: event.target.value }))} required placeholder="Titulo de tarea" style={inputStyle} />
            <textarea value={taskForm.description} onChange={(event) => setTaskForm((prev) => ({ ...prev, description: event.target.value }))} placeholder="Descripcion" style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <select value={taskForm.priority} onChange={(event) => setTaskForm((prev) => ({ ...prev, priority: event.target.value }))} style={inputStyle}>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              <input type="date" value={taskForm.dueDate} onChange={(event) => setTaskForm((prev) => ({ ...prev, dueDate: event.target.value }))} style={inputStyle} />
              <button type="submit" style={actionButtonStyle}><Plus size={14} /> Crear</button>
            </div>
          </form>
          <div style={{ display: 'grid', gap: 8 }}>
            {tasks.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Sin tareas registradas.</p>}
            {tasks.map((task) => (
              <div key={task.id} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(13,14,21,0.6)', padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong>{task.title}</strong>
                  <small style={{ color: 'rgba(255,255,255,0.6)' }}>{task.priority}</small>
                </div>
                <p style={{ margin: '4px 0 8px', color: 'rgba(255,255,255,0.65)' }}>{task.description || 'Sin descripcion'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                  <select value={task.status} onChange={(event) => updateTaskStatus(task, event.target.value)} style={inputStyle}>
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En curso</option>
                    <option value="review">Revision</option>
                    <option value="completed">Completada</option>
                  </select>
                  <button type="button" onClick={() => deleteTask(task.id)} style={dangerButtonStyle}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article style={panelStyle}>
          <h3 style={panelTitleStyle}>Seguimiento</h3>
          <form onSubmit={createFollowup} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
            <textarea required value={followupForm.comment} onChange={(event) => setFollowupForm((prev) => ({ ...prev, comment: event.target.value }))} placeholder="Comentario interno" style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} />
            <input value={followupForm.nextStep} onChange={(event) => setFollowupForm((prev) => ({ ...prev, nextStep: event.target.value }))} placeholder="Proximo paso" style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <input type="datetime-local" value={followupForm.reminderAt} onChange={(event) => setFollowupForm((prev) => ({ ...prev, reminderAt: event.target.value }))} style={inputStyle} />
              <select value={followupForm.status} onChange={(event) => setFollowupForm((prev) => ({ ...prev, status: event.target.value }))} style={inputStyle}>
                <option value="abierto">Abierto</option>
                <option value="en_proceso">En proceso</option>
                <option value="cerrado">Cerrado</option>
              </select>
              <button type="submit" style={actionButtonStyle}><Save size={14} /> Guardar</button>
            </div>
          </form>
          <div style={{ display: 'grid', gap: 8 }}>
            {followups.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Sin seguimientos todavia.</p>}
            {followups.map((followup) => (
              <div key={followup.id} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(13,14,21,0.6)', padding: 10 }}>
                <p style={{ margin: 0 }}>{followup.comment}</p>
                <small style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {followup.nextStep ? `Proximo: ${followup.nextStep}` : 'Sin proximo paso'}
                </small>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#D2F23A' }}>{followup.status}</span>
                  <button type="button" onClick={() => deleteFollowup(followup.id)} style={dangerButtonStyle}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <article style={panelStyle}>
        <h3 style={panelTitleStyle}><CircleDollarSign size={18} color="#D2F23A" /> Pagos</h3>
        <form onSubmit={createPayment} style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8 }}>
            <input required value={paymentForm.concept} onChange={(event) => setPaymentForm((prev) => ({ ...prev, concept: event.target.value }))} placeholder="Concepto" style={inputStyle} />
            <input required type="number" min="1" value={paymentForm.amount} onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))} placeholder="Monto" style={inputStyle} />
            <input type="date" value={paymentForm.dueDate} onChange={(event) => setPaymentForm((prev) => ({ ...prev, dueDate: event.target.value }))} style={inputStyle} />
            <select value={paymentForm.status} onChange={(event) => setPaymentForm((prev) => ({ ...prev, status: event.target.value }))} style={inputStyle}>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="partial">Parcial</option>
              <option value="overdue">Vencido</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8 }}>
            <input value={paymentForm.method} onChange={(event) => setPaymentForm((prev) => ({ ...prev, method: event.target.value }))} placeholder="Metodo" style={inputStyle} />
            <input value={paymentForm.notes} onChange={(event) => setPaymentForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Notas" style={inputStyle} />
            <button type="submit" style={actionButtonStyle}><Plus size={14} /> Registrar</button>
          </div>
        </form>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: 8 }}>Concepto</th>
                <th style={{ padding: 8 }}>Estado</th>
                <th style={{ padding: 8 }}>Vencimiento</th>
                <th style={{ padding: 8 }}>Monto</th>
                <th style={{ padding: 8, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 10, color: 'rgba(255,255,255,0.6)' }}>Sin pagos cargados para este cliente.</td>
                </tr>
              )}
              {payments.map((payment) => (
                <tr key={payment.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <td style={{ padding: 8 }}>{payment.concept}</td>
                  <td style={{ padding: 8 }}>{payment.status}</td>
                  <td style={{ padding: 8 }}>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('es-AR') : '-'}</td>
                  <td style={{ padding: 8 }}>{money(payment.amount)}</td>
                  <td style={{ padding: 8, textAlign: 'right' }}>
                    <button type="button" onClick={() => deletePayment(payment.id)} style={dangerButtonStyle}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article style={panelStyle}>
        <h3 style={panelTitleStyle}><CalendarClock size={18} color="#B89BFF" /> Entregables</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {deliveries.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay entregables registrados.</p>}
          {deliveries.map((delivery) => (
            <div key={delivery.id} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(13,14,21,0.6)', padding: 10 }}>
              <strong>{delivery.title}</strong>
              <p style={{ margin: '6px 0', color: 'rgba(255,255,255,0.65)' }}>{delivery.description || 'Sin descripcion'}</p>
              <small style={{ color: delivery.status === 'delivered' ? '#7ef0b3' : '#ffb97a' }}>
                {delivery.status === 'delivered' ? <CheckCircle2 size={14} style={{ marginRight: 4 }} /> : null}
                {delivery.status}
              </small>
            </div>
          ))}
        </div>
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

const panelTitleStyle = {
  marginTop: 0,
  marginBottom: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const cardStyle = {
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  padding: 12,
};

const cardLabelStyle = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '0.84rem',
};

const cardValueStyle = {
  fontSize: '1.5rem',
  display: 'block',
  marginTop: 4,
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
  padding: '8px 10px',
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
