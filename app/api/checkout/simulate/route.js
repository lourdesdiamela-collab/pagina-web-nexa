import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { approveOrder } from '@/lib/orders';
import { isMpConfigured } from '@/lib/mercadopago';

// Solo existe para poder probar el flujo de compra de punta a punta sin
// credenciales reales de Mercado Pago. Se autodesactiva apenas Lu carga
// MP_ACCESS_TOKEN: a partir de ahí el checkout usa Mercado Pago real y esta
// ruta deja de aceptar pedidos.
export async function POST(request) {
  if (isMpConfigured()) {
    return NextResponse.json({ error: 'Mercado Pago ya está configurado — usá el checkout real.' }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Necesitás iniciar sesión.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });
  }
  if (order.status !== 'PENDING') {
    return NextResponse.json({ error: 'Este pedido ya fue procesado.' }, { status: 400 });
  }

  await approveOrder(orderId, { mpPaymentId: `SIMULATED-${Date.now()}`, payerEmail: session.user.email });

  return NextResponse.json({ success: true, orderId });
}
