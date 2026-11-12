import { NextResponse } from 'next/server';
import { isMpConfigured, createPreference } from '@/lib/mercadopago';
import { kitPorSlug } from '@/lib/kits.mjs';
import { generarReferenciaKit } from '@/lib/kitsAcceso';
import { saveLead } from '@/lib/crm';
import { notifyEvent } from '@/lib/notifications';
import { buildTermsAcceptance } from '@/lib/terms';
import { EMAIL_VALIDO, emailUnico, texto } from '@/lib/seguridad';
import { limitar, ipCliente, MINUTO, HORA } from '@/lib/rateLimit';

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

// Compra de un Kit IA con Mercado Pago (Checkout Pro), sin cuenta ni login.
// El precio sale de lib/kits.mjs, nunca del navegador. Cuando Mercado Pago
// avisa el pago aprobado, el webhook manda el mail con el enlace de descarga
// (ver app/api/mercadopago/webhook/route.js).
export async function POST(request) {
  if (!(await limitar('kit-checkout', ipCliente(request), { maximo: 6, ventanaMs: 10 * MINUTO }))) {
    return NextResponse.json({ error: 'Recibimos muchos intentos seguidos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const kit = kitPorSlug(String(body?.kit || ''));
  if (!kit) return NextResponse.json({ error: 'No encontramos ese kit.' }, { status: 400 });

  const name = texto(body?.name, 120);
  const email = emailUnico(body?.email);
  if (name.length < 2) return NextResponse.json({ error: 'Escribí tu nombre.' }, { status: 400 });
  if (!email || !EMAIL_VALIDO.test(email)) return NextResponse.json({ error: 'Revisá tu email: parece que tiene un error.' }, { status: 400 });

  const { error: termsError, data: terms } = buildTermsAcceptance(body, request);
  if (termsError) return NextResponse.json({ error: termsError }, { status: 400 });

  if (!isMpConfigured()) {
    return NextResponse.json(
      { error: 'El pago online no está disponible por el momento. Escribinos por WhatsApp y te ayudamos.', paymentUnavailable: true },
      { status: 503 },
    );
  }

  if (!(await limitar('kit-checkout-destino', email, { maximo: 4, ventanaMs: HORA }))) {
    return NextResponse.json({ error: 'Ya hiciste varios intentos con este email. Probá de nuevo más tarde.' }, { status: 429 });
  }

  const referencia = generarReferenciaKit();

  try {
    await saveLead({
      name, email, service: `kit-${kit.slug}`,
      challenge: `Compra iniciada — Kit "${kit.titulo}" vía Mercado Pago`,
      source: 'checkout_kit_mercadopago', reference: referencia, amount: kit.precio,
      termsAcceptedAt: terms.termsAcceptedAt.toISOString(), termsAcceptedIp: terms.termsAcceptedIp, termsVersion: terms.termsVersion,
    });
  } catch (e) {
    console.error('Error al guardar el lead de kit:', e);
  }

  try {
    await notifyEvent({
      type: 'kit_compra_iniciada',
      title: 'Compra de kit iniciada (Mercado Pago)',
      message: `${name} inició la compra del kit "${kit.titulo}".`,
      details: { referencia, kit: kit.slug, amount: kit.precio },
    });
  } catch (e) {
    console.error('Error en notifyEvent (kit):', e);
  }

  try {
    const base = siteUrl();
    const preference = await createPreference({
      orderId: referencia,
      title: `NEXA Kit IA — ${kit.titulo}`,
      total: kit.precio,
      payerEmail: email,
      backUrls: {
        success: `${base}/kits/gracias`,
        failure: `${base}/soluciones-ia/comprar?pago=fallo`,
        pending: `${base}/kits/gracias`,
      },
      metadata: { kind: 'kit', kit: kit.slug, reference: referencia, name, email },
    });
    return NextResponse.json({ reference: referencia, initPoint: preference.init_point });
  } catch (e) {
    console.error('Error creando la preferencia de Mercado Pago del kit:', e);
    return NextResponse.json({ error: 'No pudimos iniciar el pago. Probá de nuevo o escribinos por WhatsApp.' }, { status: 500 });
  }
}
