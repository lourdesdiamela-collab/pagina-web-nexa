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
 *
 * `linkPago` (opcional): link al checkout del mismo plan con
 * `?renueva=<id del plan>`. Si el cliente paga desde ahí con Mercado Pago, el
 * CRM renueva el plan solo (ya no hace falta apretar "Marcar renovado"). Solo
 * se acepta un link a /servicios/checkout de este mismo sitio.
 */

function linkDePagoValido(valor) {
  if (!valor) return null;
  try {
    const url = new URL(String(valor));
    const propios = new Set(['nexagrowth.com.ar', 'www.nexagrowth.com.ar']);
    try {
      if (process.env.NEXT_PUBLIC_SITE_URL) propios.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).host);
    } catch {
      // NEXT_PUBLIC_SITE_URL mal cargada: se sigue con los dominios fijos.
    }
    if (url.protocol !== 'https:' || !propios.has(url.host) || url.pathname !== '/servicios/checkout') return null;
    return url.toString().replace(/"/g, '%22');
  } catch {
    return null;
  }
}

function botonPago(href) {
  return `<p style="margin:24px 0"><a href="${href}" style="background:#6D4AD6;color:#ffffff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Pagar ahora con Mercado Pago</a></p>
      <p style="font-size:13px;color:#555">Al pagar desde este botón tu plan se renueva automáticamente, sin que tengas que avisarnos.</p>`;
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
  const nombre = String(body?.nombre || '').trim();
  const tipo = body?.tipo === 'vencido' ? 'vencido' : 'recordatorio';
  const servicio = String(body?.servicio || 'tu servicio con NEXA').trim();
  const monto = Number(body?.monto) || 0;
  const fechaVenc = String(body?.fechaVenc || '').trim();
  const linkPago = linkDePagoValido(body?.linkPago);

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
      ${linkPago ? botonPago(linkPago) : ''}
      <p>Si ya lo hiciste por otro medio, contanos por WhatsApp o respondé este mail para que lo actualicemos. Si necesitás coordinar algo, escribinos para no interrumpir el servicio.</p>
      <p>— El equipo de NEXA</p>
    `
    : `
      <p>Hola ${nombre || 'equipo'},</p>
      <p>Te recordamos que el próximo pago mensual de <strong>${servicio}</strong> vence el <strong>${fechaVenc || 'próximo'}</strong>${montoTexto ? ` (${montoTexto})` : ''}.</p>
      ${linkPago ? botonPago(linkPago) : ''}
      <p>Si preferís pagar por transferencia o tenés alguna duda, escribinos por WhatsApp o respondé este mail.</p>
      <p>— El equipo de NEXA</p>
    `;

  const resultado = await sendMail({ to, fromName: 'NEXA', subject: asunto, html });

  if (!resultado.sent) {
    return NextResponse.json({ ok: false, error: resultado.error || 'No se pudo enviar el email.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
