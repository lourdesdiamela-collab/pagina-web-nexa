import { NextResponse } from 'next/server';
import { applyTransferDiscount } from '@/lib/pricing';
import { generateServiceReference, validateServiceCheckoutBody, sendServiceLeadEmails } from '@/lib/serviceCheckout';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

// Pedido "voy a pagar por transferencia bancaria" para un plan de servicio,
// con el mismo 10% OFF que ya se usa en el checkout de Aprende
// (lib/pricing.js, applyTransferDiscount). No hay verificación automática de
// pago (no hay integración bancaria): Lu confirma manualmente mirando su
// cuenta y se contacta con el cliente para coordinar el arranque. A
// diferencia de Aprende, acá no hay panel de admin ni tabla Order — la
// confirmación llega por email (ver SERVICIOS_CHECKOUT.md).
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const validationError = validateServiceCheckoutBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { name, email, phone, company, servicio, planLabel, billing } = body;
  const amount = Math.round(Number(body.amount));
  const discountedTotal = applyTransferDiscount(amount);
  const reference = generateServiceReference();

  try {
    await saveLead({
      name,
      email,
      company: company || 'No especificado',
      phone,
      service: servicio,
      challenge: `Pedido por transferencia — ${planLabel}`,
    });
  } catch (dbError) {
    console.error('Error al guardar lead de servicio:', dbError);
  }

  try {
    await notifyEvent({
      type: 'servicio_pedido_transferencia',
      title: 'Pedido de servicio por transferencia',
      message: `${name} registró un pedido de ${planLabel} por transferencia.`,
      details: { reference, servicio, planLabel, amount: discountedTotal },
    });
  } catch (notifyErr) {
    console.error('Error en notifyEvent:', notifyErr);
  }

  try {
    await sendServiceLeadEmails({ reference, name, email, phone, company, servicio, planLabel, amount: discountedTotal, billing, method: 'transfer' });
  } catch (mailError) {
    console.error('Error enviando emails de pedido de servicio:', mailError);
  }

  return NextResponse.json({ reference, total: discountedTotal });
}
