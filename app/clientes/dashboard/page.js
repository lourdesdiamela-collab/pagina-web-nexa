import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';
import { listFollowups, listPayments } from '@/lib/crm';
import { CalendarClock, CheckCircle2, CircleDollarSign, Workflow } from 'lucide-react';

function money(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

export default async function ClientDashboardPage() {
  const session = await getSession();

  const [clientResult, tasksResult, deliveriesResult, followups, payments] = await Promise.all([
    supabaseAdmin.from('clients').select('id,company,plan,service,status').eq('id', session.clientId).single(),
    supabaseAdmin.from('tasks').select('id,title,status,priority,due_date,created_at').eq('client_id', session.clientId).order('created_at', { ascending: false }).limit(10),
    supabaseAdmin.from('deliveries').select('id,title,status,description,created_at').eq('client_id', session.clientId).order('created_at', { ascending: false }).limit(10),
    listFollowups({ clientId: session.clientId }),
    listPayments({ clientId: session.clientId }),
  ]);

  const client = clientResult.data;
  const tasks = tasksResult.data || [];
  const deliveries = deliveriesResult.data || [];
  const openTasks = tasks.filter((task) => task.status !== 'completed');
  const openFollowups = followups.filter((item) => item.status !== 'cerrado');
  const pendingPayments = payments.filter((payment) => ['pending', 'overdue'].includes(payment.status));
  const pendingAmount = pendingPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return (
    <div>
      <header style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: '1.85rem' }}>Hola, {session.name?.split(' ')[0]}</h2>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>
          Este es el estado actual de tu cuenta en NEXA.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Servicio activo</div>
          <strong style={cardValueStyle}>{client?.service || 'Marketing Integral'}</strong>
          <small style={{ color: 'rgba(255,255,255,0.6)' }}>{client?.plan || 'Plan vigente'}</small>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Tareas abiertas</div>
          <strong style={cardValueStyle}>{openTasks.length}</strong>
          <small style={{ color: 'rgba(255,255,255,0.6)' }}>{tasks.length} tareas registradas</small>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Seguimientos</div>
          <strong style={cardValueStyle}>{openFollowups.length}</strong>
          <small style={{ color: 'rgba(255,255,255,0.6)' }}>Entradas activas</small>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Saldo pendiente</div>
          <strong style={{ ...cardValueStyle, color: pendingAmount > 0 ? '#ffb97a' : '#7ef0b3' }}>{money(pendingAmount)}</strong>
          <small style={{ color: 'rgba(255,255,255,0.6)' }}>{pendingPayments.length} comprobantes</small>
        </article>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><Workflow size={18} color="#D2F23A" /> Proximas tareas</h3>
          {tasks.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Todavia no hay tareas cargadas.</p>}
          {tasks.length > 0 && (
            <div style={{ display: 'grid', gap: 8 }}>
              {tasks.slice(0, 6).map((task) => (
                <div key={task.id} style={itemStyle}>
                  <div>
                    <strong>{task.title}</strong>
                    <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{task.priority}</div>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: task.status === 'completed' ? '#7ef0b3' : '#ffb97a' }}>{task.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><CalendarClock size={18} color="#B89BFF" /> Seguimiento y entregas</h3>
          {followups.length === 0 && deliveries.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay novedades recientes.</p>}
          {followups.slice(0, 3).map((item) => (
            <div key={item.id} style={itemStyle}>
              <div>
                <strong>{item.comment}</strong>
                <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{item.nextStep || 'Sin proximo paso'}</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#D2F23A' }}>{item.status}</span>
            </div>
          ))}
          {deliveries.slice(0, 3).map((delivery) => (
            <div key={delivery.id} style={itemStyle}>
              <div>
                <strong>{delivery.title}</strong>
                <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{delivery.description || 'Sin detalle adicional'}</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: delivery.status === 'delivered' ? '#7ef0b3' : '#ffb97a', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                {delivery.status === 'delivered' ? <CheckCircle2 size={13} /> : null}
                {delivery.status}
              </span>
            </div>
          ))}
        </article>
      </section>

      <section style={{ ...panelStyle, marginTop: 14 }}>
        <h3 style={panelTitleStyle}><CircleDollarSign size={18} color="#D2F23A" /> Resumen de pagos</h3>
        {payments.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay pagos registrados.</p>}
        {payments.length > 0 && (
          <div style={{ display: 'grid', gap: 8 }}>
            {payments.slice(0, 6).map((payment) => (
              <div key={payment.id} style={itemStyle}>
                <div>
                  <strong>{payment.concept}</strong>
                  <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{payment.method || 'Metodo no definido'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>{money(payment.amount)}</strong>
                  <div style={{ color: payment.status === 'paid' ? '#7ef0b3' : '#ffb97a', fontSize: '0.82rem' }}>{payment.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
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
  fontSize: '1.4rem',
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
