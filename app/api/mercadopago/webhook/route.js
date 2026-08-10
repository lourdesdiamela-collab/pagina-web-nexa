import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPayment } from '@/lib/mercadopago';
import { approveOrder, rejectOrder } from '@/lib/orders';
import { sendServicePaymentApprovedEmails } from '@/lib/serviceCheckout';

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

    // Pago de un plan de servicio (Marketing/Social/Ads/Recover/CRM/Web):
    // no tiene Order en la base como Aprende, así que la referencia y los
    // datos del cliente viajan en la metadata de la preferencia (ver
    // app/api/checkout/servicio-preference/route.js). Nota: sin una tabla
    // propia no hay forma de marcar "ya procesado", así que si Mercado Pago
    // reintenta la notificación del mismo pago aprobado, el email de
    // confirmación se puede volver a mandar — riesgo aceptado y documentado
    // en SERVICIOS_CHECKOUT.md (no debería pasar seguido: MP no reintenta
    // notificaciones ya entregadas con 200 OK).
    if (payment.metadata?.kind === 'servicio' && payment.status === 'approved') {
      try {
        await sendServicePaymentApprovedEmails({
          reference: payment.metadata.reference || orderId,
          name: payment.metadata.name || 'Cliente',
          email: payment.metadata.email,
          planLabel: payment.metadata.plan_label || 'tu plan',
          amount: payment.transaction_amount,
        });
      } catch (serviceMailError) {
        console.error('Error mandando email de pago de servicio aprobado:', serviceMailError);
      }
      return NextResponse.json({ received: true });
    }
    if (payment.metadata?.kind === 'servicio') {
      return NextResponse.json({ received: true });
    }

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
