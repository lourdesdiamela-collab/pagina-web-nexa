import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/products.mjs';

export default async function AdminDashboardPage() {
  const [orderCount, approvedOrders, userCount, productCount, reviewCount, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ where: { status: 'APPROVED' }, select: { total: true } }),
    prisma.user.count(),
    prisma.product.count(),
    prisma.review.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
  ]);

  const revenue = approvedOrders.reduce((sum, o) => sum + o.total, 0);

  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { qty: true },
    where: { order: { status: 'APPROVED' } },
    orderBy: { _sum: { qty: 'desc' } },
    take: 5,
  });
  const topProducts = await Promise.all(
    topProductsRaw
      .filter((t) => t.productId)
      .map(async (t) => {
        const product = await prisma.product.findUnique({ where: { id: t.productId }, select: { title: true, slug: true } });
        return { title: product?.title || 'Producto eliminado', qty: t._sum.qty };
      })
  );

  const STATUS_LABEL = { APPROVED: 'Aprobado', PENDING: 'Pendiente', REJECTED: 'Rechazado', CANCELLED: 'Cancelado' };

  return (
    <>
      <h1>Resumen</h1>
      <p className="admin-subtitle">Estado general de la tienda, en vivo desde la base de datos.</p>

      <div className="aprende-admin-stats">
        <div className="aprende-admin-stat"><span>Ingresos aprobados</span><strong>{formatPrice(revenue)}</strong></div>
        <div className="aprende-admin-stat"><span>Pedidos totales</span><strong>{orderCount}</strong></div>
        <div className="aprende-admin-stat"><span>Usuarios</span><strong>{userCount}</strong></div>
        <div className="aprende-admin-stat"><span>Productos</span><strong>{productCount}</strong></div>
        <div className="aprende-admin-stat"><span>Reseñas</span><strong>{reviewCount}</strong></div>
      </div>

      <div className="aprende-admin-card">
        <h2>Productos más vendidos</h2>
        {topProducts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Todavía no hay ventas aprobadas.</p>
        ) : (
          <div className="aprende-admin-table-wrap">
            <table className="aprende-admin-table">
              <thead><tr><th>Producto</th><th>Unidades vendidas</th></tr></thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.title}><td>{p.title}</td><td>{p.qty}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="aprende-admin-card">
        <div className="aprende-admin-topbar">
          <h2>Últimos pedidos</h2>
          <Link href="/aprende/admin/pedidos">Ver todos →</Link>
        </div>
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead><tr><th>Pedido</th><th>Cliente</th><th>Ítems</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name} <br /><span style={{ color: 'var(--text-muted)' }}>{o.user?.email}</span></td>
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td><span className={`aprende-status-badge aprende-status-${o.status}`}>{STATUS_LABEL[o.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
