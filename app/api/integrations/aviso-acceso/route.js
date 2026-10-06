import { NextResponse } from 'next/server';
import { verifyCrmSecret } from '@/lib/crmAuth';
import { sendMail } from '@/lib/mailer';

/**
 * POST /api/integrations/aviso-acceso
 *
 * El CRM (Nexa-CRM) le pega acá para que el sitio mande el recordatorio de un
 * acceso que el cliente todavía no dio (herramienta #3: panel de accesos).
 * Mismo criterio que /api/integrations/aviso-cobranza: el CRM no tiene Gmail
 * propio y delega el envío al sitio, autenticado con SITE_TO_CRM_SECRET.
 *
 * Body: { to, nombre, etiquetaAcceso, dias: 3 | 7 }
 */

function escapar(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function crmBaseUrl() {
  return (process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.nexagrowth.com.ar').replace(/\/+$/, '');
}

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
  const nombre = escapar(String(body?.nombre || '').trim().slice(0, 120));
  const acceso = escapar(String(body?.etiquetaAcceso || 'un acceso pendiente').trim().slice(0, 200));
  const dias = Number(body?.dias) === 7 ? 7 : 3;

  if (!to) {
    return NextResponse.json({ error: 'Falta el destinatario (to).' }, { status: 400 });
  }

  const portal = `${crmBaseUrl()}/portal/accesos`;
  const asunto = dias === 7
    ? `Seguimos esperando un acceso para avanzar — NEXA`
    : `Te falta darnos un acceso — NEXA`;

  const html = `
    <p>Hola ${nombre || 'equipo'},</p>
    <p>${dias === 7
      ? 'Hace una semana que esperamos este acceso y sin él no podemos avanzar con esa parte del trabajo:'
      : 'Para arrancar con tu servicio todavía necesitamos este acceso:'}</p>
    <p style="font-size:16px"><strong>${acceso}</strong></p>
    <p>En tu portal de cliente tenés el detalle de cada acceso pendiente y podés marcar los que ya nos diste:</p>
    <p style="margin:24px 0"><a href="${portal}" style="background:#6D4AD6;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Ver mis accesos pendientes</a></p>
    <p>Si tenés dudas sobre cómo darlo, respondé este mail o escribinos por WhatsApp y te guiamos paso a paso.</p>
    <p>— El equipo de NEXA</p>
  `;

  const resultado = await sendMail({ to, fromName: 'NEXA', subject: asunto, html });

  if (!resultado.sent) {
    return NextResponse.json({ ok: false, error: resultado.error || 'No se pudo enviar el email.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
