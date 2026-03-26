import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Building2, Mail, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ClientDetail({ params }) {
  const session = await getSession();
  if (!session || !['admin', 'team'].includes(session.role)) return notFound();

  const { id } = params;

  // Fetch client and related data in parallel
  const [
    { data: client, error },
    { data: tasks },
    { data: deliveries },
    { data: payments }
  ] = await Promise.all([
    supabase.from('clients').select('*, users(email, name)').eq('id', id).single(),
    supabase.from('tasks').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('deliveries').select('*').eq('client_id', id).order('created_at', { ascending: false }),
    supabase.from('payments').select('amount, status').eq('client_id', id)
  ]);

  if (error || !client) return notFound();

  const openTasks = (tasks || []).filter(t => t.status !== 'completed').length;
  const pendingDeliveries = (deliveries || []).filter(d => d.status !== 'delivered').length;
  const pendingDebt = (payments || []).filter(p => p.status === 'pending').reduce((a, b) => a + (b.amount || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <Link href="/admin/clientes" style={{ color: '#B89BFF', fontSize: '0.9rem', fontWeight: 600, display: 'inline-block', marginBottom: '16px', textDecoration: 'none' }}>
          ← Volver a Clientes
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#12141D', fontSize: '2.4rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Building2 color="#12141D" /> {client.company}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#B89BFF', background: 'rgba(184, 155, 255, 0.1)', padding: '4px 12px', borderRadius: '100px' }}>
                Plan {client.plan}
              </span>
              {client.status === 'active' 
                ? <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#28C76F', background: 'rgba(40, 199, 111, 0.1)', padding: '4px 12px', borderRadius: '100px' }}>Activo</span>
                : <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)', padding: '4px 12px', borderRadius: '100px' }}>Inactivo</span>
              }
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
              <Mail size={16} /> {client.users?.email || client.email}
            </div>
            <div style={{ color: '#12141D', fontWeight: 700 }}>Contacto: {client.contact_name}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'white', border: '1px solid #EEE', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Tareas Pendientes</div>
          <div style={{ color: '#12141D', fontSize: '2rem', fontWeight: 900 }}>{openTasks}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #EEE', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Para Entregar</div>
          <div style={{ color: '#12141D', fontSize: '2rem', fontWeight: 900 }}>{pendingDeliveries}</div>
        </div>
        <div style={{ background: 'white', border: '1px solid #EEE', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ color: '#666', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Deuda</div>
          <div style={{ color: pendingDebt > 0 ? '#ff6b6b' : '#28C76F', fontSize: '2rem', fontWeight: 900 }}>${pendingDebt.toLocaleString('es-AR')}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Tareas del cliente */}
        <section style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px' }}>
          <h2 style={{ color: '#12141D', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 color="#B89BFF" /> Agenda de Tareas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(tasks || []).length > 0 ? tasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', background: '#F9F9F9', border: '1px solid #EEE', borderLeft: `4px solid ${t.status === 'completed' ? '#28C76F' : '#B89BFF'}` }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#12141D', marginBottom: '4px' }}>{t.title}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Estado: {t.status}</div>
                </div>
              </div>
            )) : <p style={{ color: '#999', fontSize: '0.9rem' }}>Sin tareas creadas para este cliente.</p>}
          </div>
        </section>

        {/* Entregables */}
        <section style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px' }}>
          <h2 style={{ color: '#12141D', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle color="#00CFE8" /> Entregables
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(deliveries || []).length > 0 ? deliveries.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '16px', background: '#F9F9F9', border: '1px solid #EEE' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#12141D', marginBottom: '4px' }}>{d.title}</div>
                  <div style={{ fontSize: '0.8rem', color: d.status === 'delivered' ? '#28C76F' : '#FF9F43', fontWeight: 700 }}>
                    {d.status === 'delivered' ? 'Enviado ✔' : 'Pendiente'}
                  </div>
                </div>
              </div>
            )) : <p style={{ color: '#999', fontSize: '0.9rem' }}>No hay entregables documentados.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
