import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPayment } from '@/lib/mercadopago';
import { approveOrder, rejectOrder } from '@/lib/orders';

// Mercado Pago llama a esta URL (notification_url) cuando cambia el estado
// de un pago. Puede mandar los datos como query params (?type=payment&data.id=)
// o en el body, según la integración. Siempre respondemos 200 para que MP no
// reintente indefinidamente, incluso si hubo un error interno (que se loguea).
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    let body = {};
    try {
      body = await request.json();
    } catch {
      /* algunas notificaciones no traen body */
    }

    const type = searchParams.get('type') || searchParams.get('topic') || body?.type || body?.topic;
    const paymentId = searchParams.get('data.id') || body?.data?.id || body?.id;

    if (type !== 'payment' || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = await getPayment(paymentId);
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'PENDING') {
      return NextResponse.json({ received: true });
    }

    if (payment.status === 'approved') {
      await approveOrder(orderId, { mpPaymentId: String(payment.id), payerEmail: payment.payer?.email });
    } else if (payment.status === 'rejected' || payment.status === 'cancelled') {
      await rejectOrder(orderId, { mpPaymentId: String(payment.id) });
    }
    // 'pending' / 'in_process' -> se deja el pedido como está, puede llegar otra notificación luego.

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('POST /api/mercadopago/webhook error:', error);
    return NextResponse.json({ received: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
