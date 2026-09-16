import { NextResponse } from 'next/server';
import { applyTransferDiscount } from '@/lib/pricing';
import { generateServiceReference, resolveServiceCheckout, sendServiceLeadEmails } from '@/lib/serviceCheckout';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';
import { buildTermsAcceptance } from '@/lib/terms';

// Pedido "voy a pagar por transferencia bancaria" para un plan de servicio,
// con el mismo 10% OFF que ya se usa en el checkout de Aprende
// (lib/pricing.js, applyTransferDiscount). No hay verificación automática de
// pago (no hay integración bancaria): Lu confirma manualmente mirando su
// cuenta y se contacta con el cliente para coordinar el arranque.
//
// El precio NO viene del cliente: se resuelve contra lib/servicePlans.mjs a
// partir del identificador de plan (ver resolveServiceCheckout).
export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  const { error: validationError, plan, contacto } = resolveServiceCheckout(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // La aceptación de los T&C se valida en el servidor: que el botón esté
  // deshabilitado en el navegador no impide llamar a esta API a mano.
  const { error: termsError, data: termsAcceptance } = buildTermsAcceptance(body, request);
  if (termsError) {
    return NextResponse.json({ error: termsError }, { status: 400 });
  }

  const { name, email, phone, company } = contacto;
  const discountedTotal = applyTransferDiscount(plan.amount);
  const reference = generateServiceReference();

  try {
    await saveLead({
      name,
      email,
      company: company || 'No especificado',
      phone,
      service: plan.lineSlug,
      challenge: `Pedido por transferencia — ${plan.planLabel}`,
      source: 'checkout_servicio_transferencia',
      reference,
      planId: plan.planId,
      amount: discountedTotal,
      termsAcceptedAt: termsAcceptance.termsAcceptedAt.toISOString(),
      termsAcceptedIp: termsAcceptance.termsAcceptedIp,
      termsVersion: termsAcceptance.termsVersion,
    });
  } catch (dbError) {
    console.error('Error al guardar lead de servicio:', dbError);
  }

  try {
    await notifyEvent({
      type: 'servicio_pedido_transferencia',
      title: 'Pedido de servicio por transferencia',
      message: `${name} registró un pedido de ${plan.planLabel} por transferencia.`,
      details: { reference, servicio: plan.lineSlug, planLabel: plan.planLabel, amount: discountedTotal },
    });
  } catch (notifyErr) {
    console.error('Error en notifyEvent:', notifyErr);
  }

  try {
    await sendServiceLeadEmails({
      reference,
      name,
      email,
      phone,
      company,
      servicio: plan.lineSlug,
      planLabel: plan.planLabel,
      amount: discountedTotal,
      billing: plan.billing,
      method: 'transfer',
      termsAcceptance,
    });
  } catch (mailError) {
    console.error('Error enviando emails de pedido de servicio:', mailError);
  }

  return NextResponse.json({ reference, total: discountedTotal });
}
