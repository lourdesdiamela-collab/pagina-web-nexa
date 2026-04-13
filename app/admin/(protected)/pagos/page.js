'use client';

import { useEffect, useState } from 'react';
import { CircleDollarSign, Plus, ReceiptText, Trash2 } from 'lucide-react';

function money(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

const PAYMENT_FORM = {
  clientId: '',
  concept: '',
  amount: '',
  dueDate: '',
  status: 'pending',
  method: 'transferencia',
  notes: '',
};

const MOVEMENT_FORM = {
  type: 'expense',
  category: 'general',
  concept: '',
  amount: '',
  date: '',
  clientId: '',
  notes: '',
};

export default function AdminPaymentsPage() {
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);
  const [movements, setMovements] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentForm, setPaymentForm] = useState(PAYMENT_FORM);
  const [movementForm, setMovementForm] = useState(MOVEMENT_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [clientsRes, paymentsRes, movementsRes, summaryRes] = await Promise.all([
        fetch('/api/admin/clientes', { cache: 'no-store' }),
        fetch('/api/admin/pagos', { cache: 'no-store' }),
        fetch('/api/admin/movimientos', { cache: 'no-store' }),
        fetch('/api/admin/finanzas', { cache: 'no-store' }),
      ]);

      const [clientsData, paymentsData, movementsData, summaryData] = await Promise.all([
        clientsRes.json(),
        paymentsRes.json(),
        movementsRes.json(),
        summaryRes.json(),
      ]);

      if (!clientsRes.ok) throw new Error(clientsData.error || 'No se pudo cargar clientes');
      if (!paymentsRes.ok) throw new Error(paymentsData.error || 'No se pudo cargar pagos');
      if (!movementsRes.ok) throw new Error(movementsData.error || 'No se pudo cargar movimientos');
      if (!summaryRes.ok) throw new Error(summaryData.error || 'No se pudo cargar reporte');

      setClients(clientsData.clients || []);
      setPayments(paymentsData.payments || []);
      setMovements(movementsData.movements || []);
      setSummary(summaryData);
      if (!paymentForm.clientId && clientsData.clients?.[0]?.id) {
        setPaymentForm((prev) => ({ ...prev, clientId: clientsData.clients[0].id }));
        setMovementForm((prev) => ({ ...prev, clientId: clientsData.clients[0].id }));
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

  const createPayment = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paymentForm, amount: Number(paymentForm.amount) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo registrar pago');
      setPaymentForm((prev) => ({ ...PAYMENT_FORM, clientId: prev.clientId }));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const createMovement = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/movimientos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...movementForm, amount: Number(movementForm.amount) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo registrar movimiento');
      setMovementForm((prev) => ({ ...MOVEMENT_FORM, clientId: prev.clientId }));
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removePayment = async (id) => {
    const ok = window.confirm('¿Eliminar este pago?');
    if (!ok) return;
    try {
      const response = await fetch(`/api/admin/pagos?id=${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar pago');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeMovement = async (id) => {
    const ok = window.confirm('¿Eliminar este movimiento?');
    if (!ok) return;
    try {
      const response = await fetch(`/api/admin/movimientos?id=${id}`, { method: 'DELETE' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo eliminar movimiento');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <header style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CircleDollarSign size={22} color="#D2F23A" /> Pagos y reporte financiero
        </h2>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Registro real de cobros, ingresos y egresos con resumen automatico.</p>
      </header>

      {error && (
        <div style={{ marginBottom: 12, borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,107,107,0.45)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Ingresos totales</div>
          <strong style={cardValueStyle}>{money(summary?.totalIncome)}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Egresos totales</div>
          <strong style={cardValueStyle}>{money(summary?.totalExpenses)}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Balance</div>
          <strong style={{ ...cardValueStyle, color: (summary?.balance || 0) >= 0 ? '#7ef0b3' : '#ffb97a' }}>{money(summary?.balance)}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Pagos pendientes</div>
          <strong style={cardValueStyle}>{money(summary?.pendingPayments)}</strong>
        </article>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><Plus size={16} color="#D2F23A" /> Registrar pago</h3>
          <form onSubmit={createPayment} style={{ display: 'grid', gap: 8 }}>
            <select required value={paymentForm.clientId} onChange={(event) => setPaymentForm((prev) => ({ ...prev, clientId: event.target.value }))} style={inputStyle}>
              <option value="">Seleccionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.company}</option>
              ))}
            </select>
            <input required value={paymentForm.concept} onChange={(event) => setPaymentForm((prev) => ({ ...prev, concept: event.target.value }))} placeholder="Concepto" style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input required type="number" min="1" value={paymentForm.amount} onChange={(event) => setPaymentForm((prev) => ({ ...prev, amount: event.target.value }))} placeholder="Monto" style={inputStyle} />
              <input type="date" value={paymentForm.dueDate} onChange={(event) => setPaymentForm((prev) => ({ ...prev, dueDate: event.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <select value={paymentForm.status} onChange={(event) => setPaymentForm((prev) => ({ ...prev, status: event.target.value }))} style={inputStyle}>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
                <option value="partial">Parcial</option>
                <option value="overdue">Vencido</option>
              </select>
              <input value={paymentForm.method} onChange={(event) => setPaymentForm((prev) => ({ ...prev, method: event.target.value }))} placeholder="Metodo" style={inputStyle} />
            </div>
            <textarea value={paymentForm.notes} onChange={(event) => setPaymentForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Notas" style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} />
            <button type="submit" disabled={saving} style={actionButtonStyle}><Plus size={14} /> Guardar pago</button>
          </form>
        </article>

        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><ReceiptText size={16} color="#B89BFF" /> Registrar ingreso / egreso</h3>
          <form onSubmit={createMovement} style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <select value={movementForm.type} onChange={(event) => setMovementForm((prev) => ({ ...prev, type: event.target.value }))} style={inputStyle}>
                <option value="expense">Egreso</option>
                <option value="income">Ingreso</option>
              </select>
              <input value={movementForm.category} onChange={(event) => setMovementForm((prev) => ({ ...prev, category: event.target.value }))} placeholder="Categoria" style={inputStyle} />
            </div>
            <input required value={movementForm.concept} onChange={(event) => setMovementForm((prev) => ({ ...prev, concept: event.target.value }))} placeholder="Concepto" style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input required type="number" min="1" value={movementForm.amount} onChange={(event) => setMovementForm((prev) => ({ ...prev, amount: event.target.value }))} placeholder="Monto" style={inputStyle} />
              <input type="date" value={movementForm.date} onChange={(event) => setMovementForm((prev) => ({ ...prev, date: event.target.value }))} style={inputStyle} />
            </div>
            <select value={movementForm.clientId} onChange={(event) => setMovementForm((prev) => ({ ...prev, clientId: event.target.value }))} style={inputStyle}>
              <option value="">Sin cliente asociado</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.company}</option>
              ))}
            </select>
            <textarea value={movementForm.notes} onChange={(event) => setMovementForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Notas" style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} />
            <button type="submit" disabled={saving} style={actionButtonStyle}><Plus size={14} /> Guardar movimiento</button>
          </form>
        </article>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <article style={panelStyle}>
          <h3 style={panelTitleStyle}>Pagos registrados</h3>
          {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando...</p>}
          {!loading && payments.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay pagos cargados.</p>}
          {!loading && payments.length > 0 && (
            <div style={{ display: 'grid', gap: 8 }}>
              {payments.map((payment) => (
                <div key={payment.id} style={itemStyle}>
                  <div>
                    <strong>{payment.concept}</strong>
                    <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{payment.clientName || 'Sin cliente'} · {payment.status}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>{money(payment.amount)}</strong>
                    <button type="button" onClick={() => removePayment(payment.id)} style={dangerButtonStyle}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article style={panelStyle}>
          <h3 style={panelTitleStyle}>Ingresos y egresos</h3>
          {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando...</p>}
          {!loading && movements.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay movimientos cargados.</p>}
          {!loading && movements.length > 0 && (
            <div style={{ display: 'grid', gap: 8 }}>
              {movements.map((movement) => (
                <div key={movement.id} style={itemStyle}>
                  <div>
                    <strong>{movement.concept}</strong>
                    <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>
                      {movement.type === 'income' ? 'Ingreso' : 'Egreso'} · {movement.category}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ color: movement.type === 'income' ? '#7ef0b3' : '#ffb97a' }}>{money(movement.amount)}</strong>
                    <button type="button" onClick={() => removeMovement(movement.id)} style={dangerButtonStyle}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

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

const itemStyle = {
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(13,14,21,0.6)',
  padding: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
};

const dangerButtonStyle = {
  borderRadius: 10,
  border: '1px solid rgba(255,107,107,0.45)',
  background: 'rgba(255,107,107,0.15)',
  color: '#ffd8d8',
  padding: 7,
};
