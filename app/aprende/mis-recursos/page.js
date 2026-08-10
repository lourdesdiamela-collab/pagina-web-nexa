import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Download, PackageOpen } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/products.mjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Mis Recursos | NEXA Aprende' };

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_LABEL = {
  APPROVED: 'Aprobado',
  PENDING: 'Pendiente',
  PENDING_TRANSFER: 'Esperando transferencia',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
};

export default async function MisRecursosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/aprende/cuenta/login?callbackUrl=/aprende/mis-recursos');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const approvedProductCount = orders
    .filter((o) => o.status === 'APPROVED')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 820 }}>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 4 }}>Mis recursos</h1>
          <p style={{ color: 'var(--text-body)', marginBottom: 28 }}>
            Hola {session.user.name} — {approvedProductCount > 0
              ? `tenés ${approvedProductCount} recurso${approvedProductCount > 1 ? 's' : ''} disponible${approvedProductCount > 1 ? 's' : ''} para descargar.`
              : 'todavía no tenés compras aprobadas.'}
          </p>

          {orders.length === 0 && (
            <div className="aprende-cart-empty">
              <PackageOpen size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
              <p>Todavía no hiciste ninguna compra.</p>
              <Link href="/aprende" className="btn btn-primary">Ver catálogo</Link>
            </div>
          )}

          {orders.length > 0 && (
            <div className="aprende-resource-list">
              {orders.map((order) => (
                <div key={order.id} className="aprende-resource-order">
                  <div className="aprende-resource-order-head">
                    <div>
                      <strong>Pedido #{order.id.slice(-8).toUpperCase()}</strong>
                      <br />
                      <span>{formatDate(order.createdAt)} · {formatPrice(order.total)}</span>
                    </div>
                    <span className={`aprende-status-badge aprende-status-${order.status}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                  </div>
                  {order.items.map((item) => (
                    <div key={item.id} className="aprende-resource-item">
                      <span className="aprende-resource-item-title">{item.title} × {item.qty}</span>
                      {order.status === 'APPROVED' ? (
                        item.product?.fileUrl ? (
                          <a href={`/api/download/${item.productId}`} className="aprende-download-btn">
                            <Download size={14} /> Descargar
                          </a>
                        ) : (
                          <span className="aprende-download-btn disabled">Próximamente</span>
                        )
                      ) : (
                        <span className="aprende-download-btn disabled">
                          {order.status === 'PENDING' && 'Esperando pago'}
                          {order.status === 'PENDING_TRANSFER' && 'Esperando transferencia'}
                          {order.status !== 'PENDING' && order.status !== 'PENDING_TRANSFER' && 'No disponible'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
