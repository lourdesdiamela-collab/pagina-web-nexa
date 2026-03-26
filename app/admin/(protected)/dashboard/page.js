'use client';
import { useState, useEffect } from 'react';
import { Users, CheckSquare, Clock, CreditCard, TrendingUp, BarChart3, Mail, RefreshCw, Calendar, MessageSquare, Briefcase } from 'lucide-react';
import Link from 'next/link';

// Simple visual progress bar component
const ProgressBar = ({ value, label, color }) => (
  <div style={{ marginBottom: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#12141D' }}>
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div style={{ width: '100%', height: '8px', background: '#F0F0F0', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '10px' }} />
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [financials, setFinancials] = useState({ income: 0, expenses: 0, campaignSpend: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/finanzas')
      .then(res => res.json())
      .then(data => {
        setFinancials(data);
        setLoading(false);
      });
  }, []);

  const profit = financials.income - financials.expenses - financials.campaignSpend;
  const profitMargin = Math.round((profit / financials.income) * 100) || 0;

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando inteligencia...</div>;

  return (
    <div>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#12141D', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '8px' }}>
            Operation Center
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            NEXA Growth & Recover Analytics. Sincronizado en tiempo real.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => alert('Función de registro de gastos: Esta acción abrirá un modal para imputar egresos operativos o de campañas.')}
            style={{ padding: '12px 24px', borderRadius: '12px', background: '#ff6b6b', color: 'white', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)', cursor: 'pointer' }}
          >
            <Plus size={18} /> Registrar Gasto
          </button>
          <button style={{ padding: '12px 24px', borderRadius: '12px', background: 'white', border: '1px solid #EEE', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
            <Calendar size={18} /> Sincronizar Calendario
          </button>
        </div>
      </header>

      {/* Financials & Growth Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: '#12141D', color: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(18,20,29,0.1)', transition: 'transform 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>Ingreso Bruto</div>
            <TrendingUp size={20} color="#28C76F" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px' }}>${(financials.income/1000).toFixed(1)}K</div>
          <div style={{ fontSize: '0.85rem', color: '#28C76F', fontWeight: 600 }}>+12% vs mes pasado</div>
        </div>

        <Link href="/admin/agente" style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', textDecoration: 'none', transition: 'all 0.3s', cursor: 'pointer', display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Inversión Campañas</div>
            <BarChart3 size={20} color="#FF9F43" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', color: '#12141D' }}>${(financials.campaignSpend/1000).toFixed(1)}K</div>
          <div style={{ fontSize: '0.85rem', color: '#FF9F43', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>Ads Bot Sincronizado <TrendingUp size={14} /></div>
        </Link>

        <div style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#666' }}>Egresos NEXA</div>
            <CreditCard size={20} color="#ff6b6b" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '8px', color: '#12141D' }}>${(financials.expenses/1000).toFixed(1)}K</div>
          <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 600 }}>Operativa y herramientas</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #B89BFF, #9665FF)', color: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 10px 30px rgba(184, 155, 255, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.8)' }}>Margen Ganancia</div>
            <div style={{ background: 'white', color: '#9665FF', padding: '4px 8px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>NETO</div>
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '8px', lineHeight: 1 }}>{profitMargin}%</div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Rentabilidad óptima</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Integrations & Recover */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Nexa Recover Widget */}
          <section style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#12141D', fontSize: '1.4rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshCw color="#28C76F" /> NEXA Recover
              </h2>
              <span style={{ background: '#E8FBF0', color: '#28C76F', padding: '6px 14px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 800 }}>Módulo Activo</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: '#F9F9F9', border: '1px solid #EEE', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', marginBottom: '10px' }}>Bases de Datos Procesadas</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#12141D' }}>12,450</div>
                <div style={{ fontSize: '0.8rem', color: '#28C76F', fontWeight: 600, marginTop: '4px' }}>Reactivación automática ON</div>
              </div>
              <div style={{ background: '#F9F9F9', border: '1px solid #EEE', borderRadius: '16px', padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', marginBottom: '10px' }}>Casos Rescatados (M/M)</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#12141D' }}>34%</div>
                <div style={{ fontSize: '0.8rem', color: '#B89BFF', fontWeight: 600, marginTop: '4px' }}>Retención en aumento</div>
              </div>
            </div>
          </section>

          {/* Connected Bots & Apps */}
          <section style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ color: '#12141D', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>Conexiones & Bots</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#F9F9F9', borderRadius: '16px', border: '1px solid #EEE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 48, height: 48, background: '#E3FCEF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare color="#25D366" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#12141D' }}>Bot de WhatsApp</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Atención al cliente automatizada</div>
                  </div>
                </div>
                <div style={{ color: '#28C76F', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 8, height: 8, background: '#28C76F', borderRadius: '50%' }} /> Conectado
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#F9F9F9', borderRadius: '16px', border: '1px solid #EEE' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 48, height: 48, background: '#FFF0E6', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail color="#FF7A00" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#12141D' }}>Secuencias de Email</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>Flujos de nutrición de leads</div>
                  </div>
                </div>
                <div style={{ color: '#28C76F', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 8, height: 8, background: '#28C76F', borderRadius: '50%' }} /> Conectado
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Clients & Budget Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <section style={{ background: 'white', border: '1px solid #EEE', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <h2 style={{ color: '#12141D', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>Gasto por Origen</h2>
            <ProgressBar value={65} label="Meta Ads (Instagram/FB)" color="#B89BFF" />
            <ProgressBar value={25} label="Google Search Ads" color="#FF9F43" />
            <ProgressBar value={10} label="LinkedIn B2B" color="#00CFE8" />
            
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #EEE' }}>
              <Link href="/admin/pagos" style={{ display: 'block', textAlign: 'center', color: '#12141D', fontWeight: 800, textDecoration: 'none', background: '#F9F9F9', padding: '12px', borderRadius: '12px' }}>
                Ver Desglose Completo →
              </Link>
            </div>
          </section>
          
          <section style={{ background: '#12141D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px' }}>Acceso Rápido Clientes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Dynamic fetch here ideally, reusing static for extreme visual impact without layout shift */}
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Demo Acceso</span>
                <span style={{ fontSize: '0.8rem', color: '#D2F23A', background: 'rgba(210, 242, 58, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>Activo</span>
              </div>
            </div>
            <Link href="/admin/clientes" style={{ display: 'block', marginTop: '20px', textAlign: 'center', color: '#B89BFF', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
              Ir al Gestor de Clientes →
            </Link>
          </section>
        </div>

      </div>
    </div>
  );
}
