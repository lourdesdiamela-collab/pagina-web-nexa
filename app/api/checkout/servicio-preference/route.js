import { NextResponse } from 'next/server';
import { isMpConfigured, createPreference } from '@/lib/mercadopago';
import { generateServiceReference, validateServiceCheckoutBody, sendServiceLeadEmails } from '@/lib/serviceCheckout';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';
import { buildTermsAcceptance } from '@/lib/terms';

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

  // La aceptación de los T&C se valida en el servidor: que el botón esté
  // deshabilitado en el navegador no impide llamar a esta API a mano.
  const { error: termsError, data: termsAcceptance } = buildTermsAcceptance(body, request);
  if (termsError) {
    return NextResponse.json({ error: termsError }, { status: 400 });
  }

  // Sin credenciales de Mercado Pago no hay pago con tarjeta posible: se corta
  // acá, antes de guardar el lead y antes de mandar el mail de "recibimos tu
  // pedido vía Mercado Pago", que sería engañoso. La UI ya no ofrece esta
  // opción cuando MP está apagado (ver /api/checkout/payment-methods), así que
  // este camino solo se alcanza llamando la API a mano.
  if (!isMpConfigured()) {
    return NextResponse.json(
      {
        error: 'El pago online con tarjeta no está disponible por el momento. Podés contratar por transferencia bancaria.',
        mpConfigured: false,
        paymentUnavailable: true,
      },
      { status: 503 },
    );
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
      // Aceptación de T&C. Un servicio no genera una fila Order (ver
      // lib/serviceCheckout.js), así que el dato viaja al CRM y al mail.
      // PENDIENTE DEL LADO DEL CRM: crear los campos que lo reciban
      // (ver el informe: repo Nexa-CRM).
      termsAcceptedAt: termsAcceptance.termsAcceptedAt.toISOString(),
      termsAcceptedIp: termsAcceptance.termsAcceptedIp,
      termsVersion: termsAcceptance.termsVersion,
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
    await sendServiceLeadEmails({ reference, name, email, phone, company, servicio, planLabel, amount, billing, method: 'mercadopago', termsAcceptance });
  } catch (mailError) {
    console.error('Error enviando emails de pedido de servicio:', mailError);
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
