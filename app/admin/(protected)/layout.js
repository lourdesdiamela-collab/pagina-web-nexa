import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LayoutDashboard, Users, CheckSquare, CreditCard, Settings2 } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import DashboardShell from '@/components/DashboardShell';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Clientes', path: '/admin/clientes', icon: Users },
  { name: 'Tareas', path: '/admin/tareas', icon: CheckSquare },
  { name: 'Pagos y Finanzas', path: '/admin/pagos', icon: CreditCard },
  { name: 'Integraciones', path: '/admin/agente', icon: Settings2 },
];

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session || !['admin', 'team'].includes(session.role)) {
    redirect('/portal');
  }

  const sidebar = (
    <>
      <div>
        <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>
          CRM operativo
        </p>
        <h1 style={{ margin: '10px 0 0', fontSize: '1.5rem', letterSpacing: '-0.02em', color: 'white' }}>
          NEXA <span style={{ color: '#D2F23A' }}>Admin</span>
        </h1>
      </div>

      <nav style={{ display: 'grid', gap: 10 }}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="nexa-admin-nav-link"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.84)',
              textDecoration: 'none', fontWeight: 600, fontSize: '0.92rem',
            }}
          >
            <item.icon size={17} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(140deg,#D2F23A,#B89BFF)', color: '#111', display: 'grid', placeItems: 'center', fontWeight: 800, flexShrink: 0 }}>
            {session.name?.charAt(0) || 'N'}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: 'white' }}>{session.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
              {session.role === 'admin' ? 'Administrador' : 'Equipo'}
            </div>
          </div>
        </div>
        <LogoutButton isAdmin />
      </div>
    </>
  );

  return (
    <>
      <DashboardShell isDark sidebar={sidebar}>
        <div className="ds-content" style={{ maxWidth: 1260 }}>
          {children}
        </div>
      </DashboardShell>
      <style dangerouslySetInnerHTML={{__html: `
        .nexa-admin-nav-link:hover {
          border-color: rgba(184,155,255,0.45);
          background: rgba(184,155,255,0.13);
          transform: translateY(-1px);
        }
        .admin-logout-btn:hover, .logout-btn:hover {
          background: rgba(255,107,107,0.13) !important;
        }
      `}} />
    </>
  );
}
