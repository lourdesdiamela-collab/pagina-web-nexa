'use client';

import { useEffect, useState } from 'react';
import { Mail, RefreshCw, Send, Trello } from 'lucide-react';

export default function IntegrationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/integraciones', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo cargar integraciones');
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

  const runAction = async (action) => {
    setRunning(true);
    setError('');
    try {
      const response = await fetch('/api/admin/integraciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No se pudo ejecutar prueba');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Integraciones</h2>
          <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Estado real de Trello y correo centralizado del CRM.</p>
        </div>
        <button type="button" onClick={load} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '10px 12px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={16} /> Actualizar
        </button>
      </header>

      {error && (
        <div style={{ marginBottom: 12, borderRadius: 12, padding: '10px 12px', border: '1px solid rgba(255,107,107,0.45)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8' }}>
          {error}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><Mail size={18} color="#D2F23A" /> Correo de notificaciones</h3>
          {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando...</p>}
          {!loading && (
            <>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Estado: <strong>{data?.notifications?.configured ? 'Configurado' : 'Incompleto'}</strong>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Destino: <strong>{data?.notifications?.destination || 'NEXA_NOTIFICATION_EMAIL no definido'}</strong>
              </p>
              <button type="button" disabled={running} onClick={() => runAction('test_email')} style={actionButtonStyle}>
                <Send size={14} /> Probar envio
              </button>
            </>
          )}
        </article>

        <article style={panelStyle}>
          <h3 style={panelTitleStyle}><Trello size={18} color="#B89BFF" /> Trello</h3>
          {loading && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Cargando...</p>}
          {!loading && (
            <>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Estado: <strong>{data?.trello?.configured ? (data?.trello?.reachable ? 'Conectado' : 'Configurado con error') : 'Incompleto'}</strong>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                Board: <strong>{data?.trello?.board?.name || 'Definir TRELLO_BOARD_ID'}</strong>
              </p>
              <button type="button" disabled={running} onClick={() => runAction('test_trello')} style={actionButtonStyle}>
                <RefreshCw size={14} /> Probar conexion
              </button>
            </>
          )}
        </article>
      </section>

      <article style={panelStyle}>
        <h3 style={panelTitleStyle}>Ultimos eventos de sincronizacion Trello</h3>
        {!loading && data?.syncLog?.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Aun no hay sincronizaciones.</p>}
        {!loading && data?.syncLog?.length > 0 && (
          <div style={{ display: 'grid', gap: 8 }}>
            {data.syncLog.map((event, index) => (
              <div key={`${event.taskId || 'n/a'}-${index}`} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(13,14,21,0.6)', padding: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong>{event.ok ? 'OK' : 'Error'} · {event.action}</strong>
                  <small style={{ color: 'rgba(255,255,255,0.55)' }}>{new Date(event.createdAt).toLocaleString('es-AR')}</small>
                </div>
                <p style={{ margin: '5px 0 0', color: 'rgba(255,255,255,0.68)' }}>
                  {event.reason || `Task: ${event.taskId || '-'} · Card: ${event.cardId || '-'}`}
                </p>
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
