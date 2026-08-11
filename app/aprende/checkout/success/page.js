import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { CheckCircle2, Download, Clock3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/products.mjs';
import { isMpConfigured, getPayment } from '@/lib/mercadopago';
import { approveOrder, rejectOrder } from '@/lib/orders';

export const metadata = { title: 'Compra confirmada | NEXA Aprende' };

export default async function CheckoutSuccessPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/aprende/cuenta/login');

  const orderId = searchParams.external_reference || searchParams.order_id;
  if (!orderId) redirect('/aprende');

  let order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.userId !== session.user.id) redirect('/aprende');

  // Red de seguridad por si el webhook todavía no llegó: verificamos el pago directo contra Mercado Pago.
  if (order.status === 'PENDING' && searchParams.payment_id && isMpConfigured()) {
    try {
      const payment = await getPayment(searchParams.payment_id);
      if (payment.status === 'approved') {
        order = await approveOrder(order.id, { mpPaymentId: String(payment.id), payerEmail: payment.payer?.email });
      } else if (payment.status === 'rejected') {
        order = await rejectOrder(order.id, { mpPaymentId: String(payment.id) });
      }
    } catch (error) {
      console.error('Error verificando pago en success page:', error);
    }
  }

  const isApproved = order.status === 'APPROVED';

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 640 }}>
          <div className="aprende-auth-card" style={{ textAlign: 'center', maxWidth: 560 }}>
            {isApproved ? (
              <>
                <CheckCircle2 size={40} color="#5c6a12" style={{ marginBottom: 12 }} />
                <h1>¡Pago aprobado!</h1>
                <p>Tu pedido #{order.id.slice(-8).toUpperCase()} ya está confirmado. Te enviamos un email con el resumen de tu compra.</p>
              </>
            ) : (
              <>
                <Clock3 size={40} color="var(--lilac-deep)" style={{ marginBottom: 12 }} />
                <h1>Estamos confirmando tu pago</h1>
                <p>Tu pedido #{order.id.slice(-8).toUpperCase()} está siendo procesado. Esto puede tardar unos minutos — vas a ver el resultado en &quot;Mis Recursos&quot;.</p>
              </>
            )}

            <div style={{ textAlign: 'left', margin: '24px 0' }}>
              {order.items.map((item) => (
                <div key={item.id} className="aprende-resource-item">
                  <span className="aprende-resource-item-title">{item.title} × {item.qty}</span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="aprende-cart-summary-total" style={{ marginTop: 8 }}>
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <Link href="/aprende/mis-recursos" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Download size={16} /> Ver mis recursos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
