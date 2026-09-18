import { NextResponse } from 'next/server';
import { verifyCrmSecret } from '@/lib/crmAuth';
import { sendMail } from '@/lib/mailer';

/**
 * POST /api/integrations/aviso-cobranza
 *
 * El CRM (Nexa-CRM) le pega acá para pedirle al sitio que mande el aviso de
 * cobranza de un plan mensual (herramienta #9) — mismo criterio que
 * /api/integrations/formulario-inicio: el CRM no tiene credenciales de
 * Gmail propias, así que delega el despacho al sitio. Autenticado con el
 * mismo secreto compartido (SITE_TO_CRM_SECRET) que ya usan las demás
 * integraciones CRM → sitio.
 *
 * `tipo` distingue el recordatorio previo (todavía a tiempo) del aviso de
 * vencido (ya pasó la fecha) — son dos emails de tono distinto, no el mismo
 * texto con otra fecha.
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
  const tipo = body?.tipo === 'vencido' ? 'vencido' : 'recordatorio';
  const servicio = String(body?.servicio || 'tu servicio con NEXA').trim();
  const monto = Number(body?.monto) || 0;
  const fechaVenc = String(body?.fechaVenc || '').trim();

  if (!to) {
    return NextResponse.json({ error: 'Falta el destinatario (to).' }, { status: 400 });
  }

  const montoTexto = monto > 0
    ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monto)
    : null;

  const asunto = tipo === 'vencido'
    ? `Tu pago de ${servicio} está vencido — NEXA`
    : `Recordatorio: tu próximo pago de ${servicio} — NEXA`;

  const html = tipo === 'vencido'
    ? `
      <p>Hola ${nombre || 'equipo'},</p>
      <p>Te escribimos porque el pago mensual de <strong>${servicio}</strong>${fechaVenc ? ` con vencimiento el ${fechaVenc}` : ''} todavía no lo tenemos registrado${montoTexto ? ` (${montoTexto})` : ''}.</p>
      <p>Si ya lo hiciste, contanos por WhatsApp o respondé este mail para que lo actualicemos. Si todavía no, coordinemos para no interrumpir el servicio.</p>
      <p>— El equipo de NEXA</p>
    `
    : `
      <p>Hola ${nombre || 'equipo'},</p>
      <p>Te recordamos que el próximo pago mensual de <strong>${servicio}</strong> vence el <strong>${fechaVenc || 'próximo'}</strong>${montoTexto ? ` (${montoTexto})` : ''}.</p>
      <p>Cualquier duda sobre el medio de pago, escribinos por WhatsApp o respondé este mail.</p>
      <p>— El equipo de NEXA</p>
    `;

  const resultado = await sendMail({ to, fromName: 'NEXA', subject: asunto, html });

  if (!resultado.sent) {
    return NextResponse.json({ ok: false, error: resultado.error || 'No se pudo enviar el email.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
