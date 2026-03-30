import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';
import { listFollowups } from '@/lib/crm';
import { CalendarClock, CheckCircle2, Workflow } from 'lucide-react';

export default async function ClientTrackingPage() {
  const session = await getSession();
  const [tasksResult, deliveriesResult, followups] = await Promise.all([
    supabaseAdmin.from('tasks').select('id,title,status,priority,due_date,description').eq('client_id', session.clientId).order('created_at', { ascending: false }).limit(12),
    supabaseAdmin.from('deliveries').select('id,title,status,description,created_at').eq('client_id', session.clientId).order('created_at', { ascending: false }).limit(12),
    listFollowups({ clientId: session.clientId }),
  ]);

  const tasks = tasksResult.data || [];
  const deliveries = deliveriesResult.data || [];

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <header>
        <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Workflow size={22} color="#D2F23A" /> Seguimiento
        </h2>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Estado de tareas, avances y entregables.</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><Workflow size={18} color="#D2F23A" /> Tareas</h3>
          {tasks.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay tareas cargadas.</p>}
          {tasks.length > 0 && (
            <div style={{ display: 'grid', gap: 8 }}>
              {tasks.map((task) => (
                <div key={task.id} style={itemStyle}>
                  <div>
                    <strong>{task.title}</strong>
                    <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{task.description || 'Sin descripcion'}</div>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: task.status === 'completed' ? '#7ef0b3' : '#ffb97a' }}>{task.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><CalendarClock size={18} color="#B89BFF" /> Seguimiento interno</h3>
          {followups.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Sin actualizaciones recientes.</p>}
          {followups.length > 0 && (
            <div style={{ display: 'grid', gap: 8 }}>
              {followups.map((item) => (
                <div key={item.id} style={itemStyle}>
                  <div>
                    <strong>{item.comment}</strong>
                    <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{item.nextStep || 'Sin proximo paso'}</div>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#D2F23A' }}>{item.status}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <article style={panelStyle}>
        <h3 style={panelTitleStyle}><CheckCircle2 size={18} color="#7ef0b3" /> Entregables</h3>
        {deliveries.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay entregables publicados.</p>}
        {deliveries.length > 0 && (
          <div style={{ display: 'grid', gap: 8 }}>
            {deliveries.map((delivery) => (
              <div key={delivery.id} style={itemStyle}>
                <div>
                  <strong>{delivery.title}</strong>
                  <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{delivery.description || 'Sin descripcion'}</div>
                </div>
                <span style={{ fontSize: '0.82rem', color: delivery.status === 'delivered' ? '#7ef0b3' : '#ffb97a' }}>
                  {delivery.status}
                </span>
              </div>
            ))}
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
