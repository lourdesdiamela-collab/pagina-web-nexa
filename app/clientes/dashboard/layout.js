import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { CreditCard, LayoutDashboard, MessageSquare, Package } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

const NAV_ITEMS = [
  { name: 'Resumen', path: '/clientes/dashboard', icon: LayoutDashboard },
  { name: 'Seguimiento', path: '/clientes/dashboard/entregas', icon: MessageSquare },
  { name: 'Documentos', path: '/clientes/dashboard/archivos', icon: Package },
  { name: 'Pagos', path: '/clientes/dashboard/pagos', icon: CreditCard },
];

export default async function ClientDashboardLayout({ children }) {
  const session = await getSession();
  if (!session || session.role !== 'client') {
    redirect('/portal');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'radial-gradient(circle at top right, rgba(184,155,255,0.18), rgba(13,14,21,1) 45%)', color: 'white' }}>
      <aside style={{ width: 280, borderRight: '1px solid rgba(255,255,255,0.08)', background: 'rgba(12,13,22,0.78)', backdropFilter: 'blur(16px)', padding: 24, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)' }}>
            Portal cliente
          </p>
          <h1 style={{ margin: '10px 0 0', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
            NEXA <span style={{ color: '#D2F23A' }}>Portal</span>
          </h1>
        </div>

        <nav style={{ display: 'grid', gap: 10 }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="nexa-client-nav-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.84)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              <item.icon size={17} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(140deg,#D2F23A,#B89BFF)', color: '#111', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
              {session.name?.charAt(0) || 'C'}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{session.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>Cliente</div>
            </div>
          </div>
          <LogoutButton isAdmin={false} />
        </div>
      </aside>

      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          {children}
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .nexa-client-nav-link:hover {
              border-color: rgba(184,155,255,0.45);
              background: rgba(184,155,255,0.13);
              transform: translateY(-1px);
            }
            @media (max-width: 860px) {
              aside { width: 100% !important; position: sticky; top: 0; z-index: 20; }
              main { padding: 18px !important; }
              div[style*="min-height: '100vh'"] { flex-direction: column !important; }
            }
          `,
        }}
      />
    </div>
  );
}
