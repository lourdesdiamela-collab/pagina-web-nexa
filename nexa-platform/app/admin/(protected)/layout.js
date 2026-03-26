import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { LayoutDashboard, Users, CheckSquare, CreditCard, FileText, Send, Calendar, Bot } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default async function AdminDashboardLayout({ children }) {
  const session = await getSession();
  
  if (!session || !['admin', 'team'].includes(session.role)) {
    redirect('/admin/login');
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Agente Ads', path: '/admin/agente', icon: Bot },
    { name: 'Clientes', path: '/admin/clientes', icon: Users },
    { name: 'Tareas', path: '/admin/tareas', icon: CheckSquare },
    { name: 'Pagos', path: '/admin/pagos', icon: CreditCard },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F4FA' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'white',
        borderRight: '1px solid rgba(184, 155, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        boxShadow: '10px 0 40px rgba(184, 155, 255, 0.05)'
      }}>
        <div style={{ marginBottom: '40px', paddingLeft: '10px' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#12141D', letterSpacing: '-0.05em' }}>
            NEXA <span style={{ color: '#B89BFF' }}>Admin</span>
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', paddingLeft: '14px' }}>Gestión</div>
          {navItems.map((item, i) => (
            <Link key={i} href={item.path} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 14px', borderRadius: '12px',
              color: '#444', fontSize: '0.9rem', fontWeight: 600,
              transition: 'all 0.2s', textDecoration: 'none'
            }}
            className="admin-link">
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid #EEE', paddingTop: '20px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', marginBottom: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#12141D', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {session.name?.charAt(0) || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#12141D' }}>{session.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>{session.role === 'admin' ? 'Administrador' : 'Equipo'}</div>
            </div>
          </div>
          
          <LogoutButton isAdmin={true} />
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .admin-link:hover { background: rgba(184, 155, 255, 0.1); color: #6A35FF !important; }
        .admin-logout-btn:hover { background: rgba(211, 47, 47, 0.08); }
      `}} />
    </div>
  );
}
