import { NextResponse } from 'next/server';
import { isMpConfigured, createPreference } from '@/lib/mercadopago';
import { generateServiceReference, validateServiceCheckoutBody, sendServiceLeadEmails } from '@/lib/serviceCheckout';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

// Checkout de planes de servicios (Marketing, Social, Ads, Recover, CRM,
// Web) vía Mercado Pago Checkout Pro — mismo patrón que
// app/api/checkout/create-preference/route.js (Aprende), pero sin login ni
// Order en la base: acá el pedido viaja en la metadata de la preferencia
// (ver lib/mercadopago.js) y en el email que recibe Lu.
//
// Para planes mensuales, este pago es solo el primer mes. Ver
// SERVICIOS_CHECKOUT.md para la decisión de por qué no hay suscripción
// automática recurrente todavía.
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const validationError = validateServiceCheckoutBody(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const { name, email, phone, company, servicio, planLabel, billing } = body;
  const amount = Math.round(Number(body.amount));
  const reference = generateServiceReference();

  try {
    await saveLead({
      name,
      email,
      company: company || 'No especificado',
      phone,
      service: servicio,
      challenge: `Pago iniciado — ${planLabel} vía Mercado Pago`,
    });
  } catch (dbError) {
    console.error('Error al guardar lead de servicio:', dbError);
  }

  try {
    await notifyEvent({
      type: 'servicio_pago_iniciado',
      title: 'Pago de servicio iniciado (Mercado Pago)',
      message: `${name} inició el pago de ${planLabel}.`,
      details: { reference, servicio, planLabel, amount },
    });
  } catch (notifyErr) {
    console.error('Error en notifyEvent:', notifyErr);
  }

  try {
    await sendServiceLeadEmails({ reference, name, email, phone, company, servicio, planLabel, amount, billing, method: 'mercadopago' });
  } catch (mailError) {
    console.error('Error enviando emails de pedido de servicio:', mailError);
  }

  if (!isMpConfigured()) {
    return NextResponse.json({
      reference,
      mpConfigured: false,
      message: 'Mercado Pago todavía no está activo en este entorno. Probá con transferencia bancaria o escribinos por WhatsApp y coordinamos el pago.',
    });
  }

  try {
    const base = siteUrl();
    const preference = await createPreference({
      orderId: reference,
      title: `NEXA — ${planLabel}`,
      total: amount,
      payerEmail: email,
      backUrls: {
        success: `${base}/servicios/checkout/success`,
        failure: `${base}/servicios/checkout/failure`,
        pending: `${base}/servicios/checkout/pending`,
      },
      metadata: {
        kind: 'servicio',
        reference,
        servicio,
        plan_label: planLabel,
        billing: billing || 'mensual',
        name,
        email,
        phone,
        company: company || '',
      },
    });
    return NextResponse.json({ reference, mpConfigured: true, initPoint: preference.init_point });
  } catch (mpError) {
    console.error('Error creando preferencia de Mercado Pago para servicio:', mpError);
    return NextResponse.json({ error: 'No pudimos iniciar el pago con Mercado Pago. Probá con transferencia bancaria.' }, { status: 500 });
  }
}
