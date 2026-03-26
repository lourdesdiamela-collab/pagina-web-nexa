import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';
import { CheckCircle2, Clock, FileText, AlertCircle } from 'lucide-react';

export default async function ClientDashboardPage() {
  const session = await getSession();

  // Fetch client data
  const { data: client } = await supabase.from('clients').select('*').eq('id', session.clientId).single();
  
  // Tasks mapping sort manually or using basic order
  const { data: allTasks } = await supabase.from('tasks').select('*').eq('client_id', session.clientId).order('created_at', { ascending: true });
  const tasks = (allTasks || [])
    .sort((a, b) => {
      const order = { 'pending': 1, 'in_progress': 2, 'review': 3, 'completed': 4 };
      return (order[a.status] || 9) - (order[b.status] || 9);
    })
    .slice(0, 3);

  const { data: deliveries } = await supabase.from('deliveries').select('*').eq('client_id', session.clientId).order('created_at', { ascending: false }).limit(3);
  
  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Hola, {session.name.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
          Bienvenido a tu espacio en <strong style={{ color: 'white' }}>NEXA</strong>. Así viene el crecimiento de {client?.company || 'tu marca'}.
        </p>
      </header>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(184, 155, 255, 0.2)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ color: '#B89BFF', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Servicio Activo</div>
          <div style={{ color: 'white', fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>{client?.service || 'Marketing Integral'}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Plan: {client?.plan || 'Growth'}</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(210, 242, 58, 0.2)', borderRadius: '24px', padding: '24px' }}>
          <div style={{ color: '#D2F23A', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Estado actual</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '1.4rem', fontWeight: 700 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D2F23A', boxShadow: '0 0 10px #D2F23A' }} />
            En ejecución
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '4px' }}>El equipo está trabajando.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Next Tasks */}
        <section style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#B89BFF" /> Próximos pasos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {tasks.length > 0 ? tasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {t.status === 'completed' ? <CheckCircle2 color="#D2F23A" size={20} /> : <AlertCircle color="rgba(255,255,255,0.3)" size={20} />}
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{t.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Estado: {t.status.replace('_', ' ')}</div>
                </div>
              </div>
            )) : (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>No hay tareas pendientes registradas.</p>
            )}
          </div>
        </section>

        {/* Deliverables */}
        <section style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '30px' }}>
          <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#D2F23A" /> Últimas Entregas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(deliveries || []).length > 0 ? deliveries.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>{d.title}</div>
                  <div style={{ fontSize: '0.8rem', color: d.status === 'delivered' ? '#D2F23A' : '#B89BFF' }}>
                    {d.status === 'delivered' ? 'Entregado' : 'En revisión'}
                  </div>
                </div>
                {d.file_url && (
                  <a href={d.file_url} target="_blank" rel="noreferrer" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600 }}>Descargar</a>
                )}
              </div>
            )) : (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>No hay entregas disponibles aún.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
