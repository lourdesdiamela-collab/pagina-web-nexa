import { NextResponse } from 'next/server';
import { verifyCrmSecret } from '@/lib/crmAuth';
import { sendMail } from '@/lib/mailer';

/**
 * POST /api/integrations/aviso-acceso
 *
 * El CRM (Nexa-CRM) le pega acá para pedirle al sitio que mande el
 * recordatorio de un acceso pendiente (herramienta #3) — mismo criterio que
 * /api/integrations/formulario-inicio y /api/integrations/aviso-cobranza: el
 * CRM no tiene credenciales de Gmail propias, así que delega el despacho al
 * sitio. Autenticado con el mismo secreto compartido (SITE_TO_CRM_SECRET).
 *
 * `dias` distingue el primer recordatorio (3 días) del segundo (7 días) —
 * el segundo tiene un tono más urgente, no es el mismo texto con otro número.
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
  const etiquetaAcceso = String(body?.etiquetaAcceso || 'un acceso').trim();
  const dias = Number(body?.dias) === 7 ? 7 : 3;

  if (!to) {
    return NextResponse.json({ error: 'Falta el destinatario (to).' }, { status: 400 });
  }

  const asunto = dias === 7
    ? `Seguimos esperando un acceso para avanzar — NEXA`
    : `Nos falta un acceso para arrancar — NEXA`;

  const html = dias === 7
    ? `
      <p>Hola ${nombre || 'equipo'},</p>
      <p>Te escribimos de nuevo porque todavía no tenemos <strong>${etiquetaAcceso}</strong>, y sin eso no podemos avanzar con tu servicio.</p>
      <p>¿Necesitás ayuda para dárnoslo? Respondé este mail o escribinos por WhatsApp y lo resolvemos juntos.</p>
      <p>— El equipo de NEXA</p>
    `
    : `
      <p>Hola ${nombre || 'equipo'},</p>
      <p>Para seguir avanzando con tu servicio, nos falta que nos des <strong>${etiquetaAcceso}</strong>.</p>
      <p>Podés cargarlo vos mismo desde tu portal de cliente, o responder este mail si preferís coordinarlo con nosotros.</p>
      <p>— El equipo de NEXA</p>
    `;

  const resultado = await sendMail({ to, fromName: 'NEXA', subject: asunto, html });

  if (!resultado.sent) {
    return NextResponse.json({ ok: false, error: resultado.error || 'No se pudo enviar el email.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
