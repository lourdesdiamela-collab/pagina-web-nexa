import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { toggleUserRole } from '@/lib/adminActions';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <>
      <h1>Usuarios</h1>
      <p className="admin-subtitle">{users.length} cuentas registradas.</p>

      <div className="aprende-admin-card">
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Pedidos</th><th>Registrado</th><th></th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'ADMIN' ? 'Admin' : 'Cliente'}</td>
                  <td>{u._count.orders}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString('es-AR')}</td>
                  <td>
                    {u.id !== session.user.id && (
                      <form action={toggleUserRole}>
                        <input type="hidden" name="id" value={u.id} />
                        <button type="submit" className="aprende-btn-mini">
                          {u.role === 'ADMIN' ? 'Quitar admin' : 'Hacer admin'}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
