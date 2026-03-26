import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';
import { DollarSign, ArrowUpRight, ArrowDownRight, Activity, Wallet, PieChart, TrendingUp, CreditCard } from 'lucide-react';

export default async function FinancialDashboard() {
  const session = await getSession();

  // Simulated financials for a highly visual ERP (MVP)
  // These represent real data structures that would be pulled from Supabase in a mature app
  const currentMonth = {
    income: 2450000,
    expenses: 850000,
    campaigns: 320000, 
  };
  
  const previousMonth = {
    income: 2100000,
    expenses: 800000,
    campaigns: 280000,
  };

  const totalOut = currentMonth.expenses + currentMonth.campaigns;
  const netProfit = currentMonth.income - totalOut;
  const profitMargin = Math.round((netProfit / currentMonth.income) * 100);

  const prevTotalOut = previousMonth.expenses + previousMonth.campaigns;
  const prevNetProfit = previousMonth.income - prevTotalOut;
  
  const growth = {
    income: Math.round(((currentMonth.income - previousMonth.income) / previousMonth.income) * 100),
    profit: Math.round(((netProfit - prevNetProfit) / prevNetProfit) * 100)
  };

  // Fetch pending client invoices from DB
  const { data: pendingPayments } = await supabase.from('payments').select('*, clients(company)').eq('status', 'pending');

  return (
    <div>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#12141D', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wallet color="#B89BFF" size={32} /> Finanzas y Rentabilidad
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Análisis visual del flujo de caja, gastos operativos y ROI de campañas.
          </p>
        </div>
        <button style={{ padding: '14px 28px', borderRadius: '14px', background: '#12141D', color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(18,20,29,0.2)' }}>
          <DollarSign size={18} /> Registrar Nuevo Ingreso
        </button>
      </header>

      {/* Hero Financial Visualizer */}
      <section style={{ background: '#12141D', borderRadius: '32px', padding: '40px', marginBottom: '40px', display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', boxShadow: '0 20px 60px rgba(184, 155, 255, 0.15)' }}>
        
        {/* Main KPI */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="#D2F23A" size={16} /> Rentabilidad Neta
          </div>
          <div style={{ fontSize: '4.5rem', fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: '16px' }}>
            {profitMargin}%
          </div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', lineHeight: 1.5 }}>
            Excelente salud financiera. Estás reteniendo más de un cuarto de tus ingresos como ganancia líquida.
          </div>
        </div>

        {/* Breakdown Visuals (No plain tables) */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 800, marginBottom: '12px', fontSize: '1.1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowUpRight color="#28C76F" size={18} /> Ingresos</span>
              <span>100%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: '100%', height: '100%', background: '#28C76F' }} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontWeight: 600 }}>Facturación total facturada a clientes.</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 800, marginBottom: '12px', fontSize: '1.1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PieChart color="#B89BFF" size={18} /> Inversión Campañas</span>
              <span>{Math.round((currentMonth.campaigns / currentMonth.income) * 100)}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((currentMonth.campaigns / currentMonth.income) * 100)}%`, height: '100%', background: '#B89BFF' }} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontWeight: 600 }}>Pauta de Ads en Meta/Google (Nexa + Clientes).</div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 800, marginBottom: '12px', fontSize: '1.1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CreditCard color="#ff6b6b" size={18} /> Operaciones NEXA</span>
              <span>{Math.round((currentMonth.expenses / currentMonth.income) * 100)}%</span>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((currentMonth.expenses / currentMonth.income) * 100)}%`, height: '100%', background: '#ff6b6b' }} />
            </div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontWeight: 600 }}>Sueldos, herramientas, y costos fijos de la agencia.</div>
          </div>
          
        </div>
      </section>

      {/* Invoices and Receivables */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Pending Invoices Visuals */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #EEE', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#12141D' }}>Dinero por Cobrar</h2>
            <div style={{ background: '#FFF0F0', color: '#ff6b6b', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>FACTURACIÓN PENDIENTE</div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(pendingPayments || []).length > 0 ? (pendingPayments || []).map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#F9F9F9', border: '1px solid #EEE', borderRadius: '16px', borderLeft: '4px solid #ff6b6b' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#12141D', fontSize: '1.1rem', marginBottom: '4px' }}>{p.clients?.company || 'Cliente'}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 600 }}>{p.description || 'Cuota mensual'}</div>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#12141D' }}>
                  ${p.amount.toLocaleString('es-AR')}
                </div>
              </div>
            )) : (
              <div style={{ padding: '30px', textAlign: 'center', background: '#F9F9F9', borderRadius: '16px', border: '2px dashed #EEE', color: '#999', fontWeight: 600 }}>
                Todos los clientes están al día. ¡Excelente trabajo!
              </div>
            )}
          </div>
        </div>

        {/* Visual Trends Card */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', border: '1px solid #EEE', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#12141D', marginBottom: '8px' }}>Crecimiento Compuesto</h2>
            <p style={{ color: '#666', fontSize: '1rem', marginBottom: '30px' }}>Comparativa de salud financiera respecto al mes pasado.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#F9F9F9', borderRadius: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Crecimiento Facturación</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#12141D' }}>+{growth.income}%</div>
                </div>
                <TrendingUp color="#28C76F" size={32} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#F9F9F9', borderRadius: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', textTransform: 'uppercase', marginBottom: '4px' }}>Crecimiento de Rentabilidad</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#12141D' }}>+{growth.profit}%</div>
                </div>
                <Activity color="#B89BFF" size={32} />
              </div>
            </div>
          </div>
          
          <button style={{ width: '100%', marginTop: '30px', padding: '16px', background: 'rgba(184, 155, 255, 0.1)', color: '#9665FF', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}>
            Descargar Reporte Financiero (PDF)
          </button>
        </div>

      </section>
    </div>
  );
}
