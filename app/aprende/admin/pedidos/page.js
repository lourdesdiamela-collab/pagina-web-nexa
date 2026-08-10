import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/products.mjs';
import { updateOrderStatus } from '@/lib/adminActions';

const STATUSES = ['PENDING', 'PENDING_TRANSFER', 'APPROVED', 'REJECTED', 'CANCELLED'];
const STATUS_LABEL = {
  APPROVED: 'Aprobado',
  PENDING: 'Pendiente (Mercado Pago)',
  PENDING_TRANSFER: 'Pendiente (transferencia)',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } }, items: true },
  });

  return (
    <>
      <h1>Pedidos</h1>
      <p className="admin-subtitle">{orders.length} pedidos totales. Los pedidos por transferencia quedan en &quot;Pendiente (transferencia)&quot; hasta que verificás el ingreso a la cuenta — cambiá el estado a &quot;Aprobado&quot; ahí para confirmar la compra y avisarle al cliente.</p>

      <div className="aprende-admin-card">
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead>
              <tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Ítems</th><th>Total</th><th>Cupón</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id.slice(-8).toUpperCase()}</td>
                  <td>{o.user?.name}<br /><span style={{ color: 'var(--text-muted)' }}>{o.user?.email}</span></td>
                  <td>{new Date(o.createdAt).toLocaleDateString('es-AR')}</td>
                  <td>{o.items.map((i) => `${i.title} ×${i.qty}`).join(', ')}</td>
                  <td>{formatPrice(o.total)}</td>
                  <td>{o.couponCode || '—'}</td>
                  <td>
                    <form action={updateOrderStatus} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} style={{ fontSize: '0.8rem', padding: '6px 8px', borderRadius: 8, border: '1px solid var(--border-light)' }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                      <button type="submit" className="aprende-btn-mini">Guardar</button>
                    </form>
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
