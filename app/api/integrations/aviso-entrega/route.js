import { NextResponse } from 'next/server';
import { verifyCrmSecret } from '@/lib/crmAuth';
import { sendMail } from '@/lib/mailer';
import { escapar, emailUnico, hostDelCrmPermitido } from '@/lib/seguridad';

/**
 * POST /api/integrations/aviso-entrega
 *
 * El CRM (oficina de agentes) le pega acá cuando una entrega pasó el control
 * del Revisor y está lista para que el cliente la apruebe en su portal, o
 * para recordársela si no respondió. Mismo criterio que aviso-acceso: el CRM
 * no tiene Gmail propio y delega el envío al sitio (SITE_TO_CRM_SECRET).
 *
 * Body: { to, nombre, titulo, link, recordatorio?: boolean }
 */

// El botón del mail solo puede llevar al CRM (portal de clientes): aunque el
// pedido venga autenticado, si el secreto se filtrara nadie podría usar este
// endpoint para mandar mails de NEXA con links a cualquier sitio.
function linkDelCrm(valor) {
  try {
    const url = new URL(String(valor || ''));
    if (url.protocol !== 'https:' || !hostDelCrmPermitido(url.host)) return null;
    return url.toString();
  } catch {
    return null;
  }
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

  // Un solo destinatario con formato válido (ver emailUnico en lib/seguridad.js).
  const to = emailUnico(body?.to) || '';
  const nombre = escapar(String(body?.nombre || '').trim().slice(0, 120));
  const titulo = escapar(String(body?.titulo || 'una entrega nueva').trim().slice(0, 200));
  const recordatorio = body?.recordatorio === true;
  const link = escapar(linkDelCrm(body?.link) || `${crmBaseUrl()}/portal/entregas`);

  if (!to) {
    return NextResponse.json({ error: 'Falta el destinatario (to) o no es un email válido.' }, { status: 400 });
  }

  const asunto = recordatorio
    ? 'Tenés una entrega esperando tu aprobación — NEXA'
    : 'Tenés una entrega nueva para revisar — NEXA';

  const html = `
    <p>Hola ${nombre || 'equipo'},</p>
    <p>${recordatorio
      ? 'Te recordamos que esta entrega sigue esperando tu respuesta. Mientras no la aprobás, no podemos avanzar con lo que sigue:'
      : 'Ya está lista para que la revises:'}</p>
    <p style="font-size:16px"><strong>${titulo}</strong></p>
    <p>Entrá a tu portal de cliente para verla. Si está bien, aprobala; si querés cambiar algo, escribinos qué y la rehacemos.</p>
    <p style="margin:24px 0"><a href="${link}" style="background:#6D4AD6;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Ver mi entrega</a></p>
    <p>Si tenés dudas, respondé este mail o escribinos por WhatsApp.</p>
    <p>— El equipo de NEXA</p>
  `;

  const resultado = await sendMail({ to, fromName: 'NEXA', subject: asunto, html });

  if (!resultado.sent) {
    return NextResponse.json({ ok: false, error: resultado.error || 'No se pudo enviar el email.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
