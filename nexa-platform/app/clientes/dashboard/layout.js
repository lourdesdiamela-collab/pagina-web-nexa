import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LayoutDashboard, FileText, CheckSquare, CreditCard } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default async function ClientDashboardLayout({ children }) {
  const session = await getSession();
  
  // Extra security check just in case middleware is bypassed
  if (!session || session.role !== 'client') {
    redirect('/clientes');
  }

  const navItems = [
    { name: 'Resumen', path: '/clientes/dashboard', icon: LayoutDashboard },
    { name: 'Pendientes', path: '/clientes/dashboard/entregas', icon: CheckSquare },
    { name: 'Documentos', path: '/clientes/dashboard/archivos', icon: FileText },
    { name: 'Facturación', path: '/clientes/dashboard/pagos', icon: CreditCard },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0D0E15' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px'
      }}>
        <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>
            NEXA <span style={{ color: '#B89BFF' }}>Portal</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item, i) => (
            <Link key={i} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '12px',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 600,
              transition: 'all 0.2s', textDecoration: 'none'
            }}
            className="sidebar-link">
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #B89BFF, #6A35FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {session.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{session.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Cliente</div>
            </div>
          </div>
          
          <LogoutButton isAdmin={false} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .sidebar-link:hover { background: rgba(255,255,255,0.05); color: white !important; }
        .logout-btn:hover { background: rgba(255,107,107,0.1); }
      `}} />
    </div>
  );
}
