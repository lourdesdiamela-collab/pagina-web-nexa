import { NextResponse } from 'next/server';
import { verifyCrmSecret } from '@/lib/crmAuth';
import { sendMail } from '@/lib/mailer';

/**
 * POST /api/integrations/formulario-inicio
 *
 * El CRM (Nexa-CRM) le pega acá para pedirle al sitio que mande el email
 * del formulario de inicio (herramienta #2) — el CRM genera el link con su
 * propio token, pero no tiene credenciales de Gmail propias, así que
 * delega el despacho al sitio, que ya manda mails de producción (formulario
 * de contacto, checkout de servicios). Autenticado con el mismo secreto
 * compartido que ya existe (SITE_TO_CRM_SECRET), en la dirección inversa
 * a como lo usa lib/crmSync.js.
 */
export async function POST(request) {
  const auth = verifyCrmSecret(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 });
  }

  const to = String(body?.to || '').trim();
  const nombre = String(body?.nombre || '').trim();
  const link = String(body?.link || '').trim();
  const validezDias = Number(body?.validezDias) || 30;

  if (!to || !link) {
    return NextResponse.json({ error: 'Faltan datos: to y link son obligatorios.' }, { status: 400 });
  }

  const resultado = await sendMail({
    to,
    fromName: 'NEXA',
    subject: 'Completá tus datos para arrancar con NEXA',
    html: `
      <p>Hola ${nombre || 'equipo'},</p>
      <p>¡Gracias por sumarte a NEXA! Para arrancar necesitamos que completes un formulario breve con tus datos de facturación, contacto, accesos y un brief de tu negocio.</p>
      <p>
        <a href="${link}" style="display:inline-block;background:#7C3AED;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Completar formulario
        </a>
      </p>
      <p>Lo podés completar en varias veces: lo que vayas cargando se guarda solo, no hace falta terminarlo de una sentada.</p>
      <p>Este link es personal e intransferible, y vence en ${validezDias} días. Si vence antes de que lo completes, escribinos y te mandamos uno nuevo.</p>
      <p>— El equipo de NEXA</p>
    `,
  });

  if (!resultado.sent) {
    return NextResponse.json({ ok: false, error: resultado.error || 'No se pudo enviar el email.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
