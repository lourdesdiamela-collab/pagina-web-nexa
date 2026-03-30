'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, AlertTriangle, CheckCircle2, CircleDollarSign, Clock3, Users, Workflow, RefreshCw } from 'lucide-react';

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

const EMPTY_STATE = {
  kpis: {
    totalClients: 0,
    activeClients: 0,
    openTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    openFollowups: 0,
    pendingPayments: 0,
    balance: 0,
  },
  latestClients: [],
  events: [],
};

export default function AdminDashboardPage() {
  const [data, setData] = useState(EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo cargar dashboard');
      setData(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { label: 'Clientes activos', value: data.kpis.activeClients, icon: Users, color: '#B89BFF' },
    { label: 'Tareas abiertas', value: data.kpis.openTasks, icon: Workflow, color: '#D2F23A' },
    { label: 'Pendientes de cobro', value: formatMoney(data.kpis.pendingPayments), icon: Clock3, color: '#FFB454' },
    { label: 'Balance actual', value: formatMoney(data.kpis.balance), icon: CircleDollarSign, color: data.kpis.balance >= 0 ? '#39D98A' : '#FF6B6B' },
  ];

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '2rem', letterSpacing: '-0.02em' }}>Panel operativo NEXA</h2>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.62)' }}>Visibilidad real de clientes, tareas, pagos y seguimiento.</p>
        </div>
        <button
          onClick={load}
          type="button"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', color: 'white', padding: '10px 14px', fontWeight: 700 }}
        >
          <RefreshCw size={16} /> Actualizar
        </button>
      </header>

      {error && (
        <div style={{ marginBottom: 16, padding: 14, borderRadius: 14, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.35)', color: '#FFD3D3' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
        {cards.map((card) => (
          <article key={card.label} style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.66)', fontSize: '0.88rem', fontWeight: 600 }}>{card.label}</span>
              <card.icon size={18} color={card.color} />
            </div>
            <strong style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>{card.value}</strong>
          </article>
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <article style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: 18 }}>
          <h3 style={{ marginTop: 0, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={18} color="#B89BFF" /> Actividad reciente
          </h3>
          {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando actividad...</p>}
          {!loading && data.events.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Todavia no hay eventos registrados.</p>}
          {!loading && data.events.length > 0 && (
            <div style={{ display: 'grid', gap: 10 }}>
              {data.events.map((event) => (
                <div key={event.id} style={{ padding: 12, borderRadius: 12, background: 'rgba(13,14,21,0.62)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <strong style={{ fontSize: '0.95rem' }}>{event.title}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.48)' }}>{new Date(event.createdAt).toLocaleString('es-AR')}</span>
                  </div>
                  <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.66)', fontSize: '0.9rem' }}>{event.message}</p>
                </div>
              ))}
            </div>
          )}
        </article>

        <article style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', padding: 18 }}>
          <h3 style={{ marginTop: 0, marginBottom: 14 }}>Acciones rapidas</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            <Link href="/admin/clientes" className="nexa-admin-action">Gestionar clientes</Link>
            <Link href="/admin/tareas" className="nexa-admin-action">Gestionar tareas</Link>
            <Link href="/admin/pagos" className="nexa-admin-action">Pagos y reporte financiero</Link>
            <Link href="/admin/agente" className="nexa-admin-action">Configurar integraciones</Link>
          </div>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.09)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.98rem' }}>Alertas</h4>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', display: 'flex', gap: 8, alignItems: 'center' }}>
              {data.kpis.overdueTasks > 0 ? <AlertTriangle size={16} color="#FFB454" /> : <CheckCircle2 size={16} color="#39D98A" />}
              {data.kpis.overdueTasks > 0 ? `${data.kpis.overdueTasks} tareas vencidas` : 'Sin tareas vencidas'}
            </p>
          </div>
        </article>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .nexa-admin-action {
              border: 1px solid rgba(255,255,255,0.12);
              border-radius: 12px;
              padding: 10px 12px;
              color: white;
              text-decoration: none;
              font-weight: 600;
              background: rgba(13,14,21,0.5);
            }
            .nexa-admin-action:hover {
              background: rgba(184,155,255,0.14);
              border-color: rgba(184,155,255,0.4);
            }
            @media (max-width: 980px) {
              section[style*="grid-template-columns: 1.4fr 1fr"] {
                grid-template-columns: 1fr !important;
              }
            }
          `,
        }}
      />
    </div>
  );
}
