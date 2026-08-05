import { requireAdminPage } from '@/lib/adminAuth';
import AdminSidebar from './AdminSidebar';

export const metadata = { title: 'Admin | NEXA Aprende', robots: { index: false, follow: false } };

export default async function AdminLayout({ children }) {
  await requireAdminPage();

  return (
    <div className="aprende-admin-shell">
      <AdminSidebar />
      <main className="aprende-admin-main">{children}</main>
    </div>
  );
}
