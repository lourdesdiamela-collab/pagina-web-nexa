import { sendMail } from './mailer';
import { formatPrice } from './products.mjs';

/*
 * Checkout de planes de servicios (Marketing, Social, Ads, Recover, CRM,
 * Web) — Mercado Pago + transferencia bancaria, mismo patrón que ya se usa
 * en Aprende (ver lib/mercadopago.js, lib/pricing.js).
 *
 * Diferencia clave con Aprende: acá no hay usuario logueado ni tabla `Order`
 * en la base de datos. Un servicio se contrata como lead (igual que
 * /api/contact), no como una compra de e-commerce. Por eso el "pedido" no
 * vive en Prisma: viaja en la referencia (`SRV-...`), en la metadata de la
 * preferencia de Mercado Pago (que Mercado Pago devuelve intacta en el
 * webhook) y en los emails que se mandan a Lu y al cliente.
 *
 * Ver SERVICIOS_CHECKOUT.md para el detalle completo de la decisión
 * (incluyendo por qué el pago es "mes 1" y no una suscripción recurrente
 * automática todavía).
 */

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'hola@nexaarg.com';

export function generateServiceReference() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SRV-${stamp}${rand}`;
}

export function validateServiceCheckoutBody(body) {
  const required = ['name', 'email', 'phone', 'servicio', 'planLabel'];
  const missing = required.filter((f) => !String(body?.[f] || '').trim());
  if (missing.length > 0) return `Faltan campos obligatorios: ${missing.join(', ')}.`;
  const amount = Number(body?.amount);
  if (!Number.isFinite(amount) || amount <= 0) return 'El monto del plan no es válido.';
  return null;
}

function billingLabel(billing) {
  return billing === 'unico' ? 'Pago único' : 'Primer pago (mes 1) — plan mensual';
}

// Emails que se mandan apenas se registra el pedido (Mercado Pago o
// transferencia), antes de que se confirme el pago — mismo criterio que
// createPendingOrder() en Aprende: toda contratación online tiene una
// respuesta automática inmediata.
export async function sendServiceLeadEmails({ reference, name, email, phone, company, servicio, planLabel, amount, billing, method }) {
  const methodLabel = method === 'transfer' ? 'Transferencia bancaria' : 'Mercado Pago';

  await sendMail({
    to: email,
    fromName: 'NEXA',
    subject: `Recibimos tu pedido — ${planLabel}`,
    html: `
      <p>Hola ${name},</p>
      <p>Recibimos tu pedido <strong>#${reference}</strong> para <strong>${planLabel}</strong> (${billingLabel(billing)}) por <strong>${formatPrice(amount)}</strong>, vía ${methodLabel}.</p>
      ${method === 'transfer'
        ? '<p>En cuanto verifiquemos el ingreso de la transferencia, te vamos a contactar para coordinar el arranque del servicio.</p>'
        : '<p>Apenas se confirme el pago te vamos a contactar para coordinar el arranque del servicio.</p>'}
      <p>Cualquier duda, respondé este email o escribinos por WhatsApp.</p>
      <p>— El equipo de NEXA</p>
    `,
  });

  await sendMail({
    to: CONTACT_EMAIL,
    fromName: 'NEXA Web',
    subject: `Nuevo pedido de servicio — ${planLabel} (${methodLabel})`,
    html: `
      <h2>Nuevo pedido de servicio</h2>
      <table cellpadding="8" style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td><strong>Referencia</strong></td><td>${reference}</td></tr>
        <tr><td><strong>Plan</strong></td><td>${planLabel}</td></tr>
        <tr><td><strong>Servicio</strong></td><td>${servicio}</td></tr>
        <tr><td><strong>Monto</strong></td><td>${formatPrice(amount)} — ${billingLabel(billing)}</td></tr>
        <tr><td><strong>Método</strong></td><td>${methodLabel}</td></tr>
        <tr><td><strong>Nombre</strong></td><td>${name}</td></tr>
        <tr><td><strong>Empresa</strong></td><td>${company || 'No especificado'}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email}</td></tr>
        <tr><td><strong>Teléfono</strong></td><td>${phone}</td></tr>
      </table>
      ${method === 'transfer'
        ? '<p><strong>Acción requerida:</strong> confirmá manualmente en tu cuenta bancaria cuando veas el ingreso y contactá al cliente para coordinar el arranque.</p>'
        : '<p>Vas a recibir otro email automático cuando Mercado Pago confirme el pago.</p>'}
    `,
  });
}

// Email que se manda cuando Mercado Pago confirma el pago aprobado (desde el
// webhook, usando la metadata de la preferencia — ver
// app/api/mercadopago/webhook/route.js).
export async function sendServicePaymentApprovedEmails({ reference, name, email, planLabel, amount }) {
  await sendMail({
    to: email,
    fromName: 'NEXA',
    subject: `¡Pago confirmado! — ${planLabel}`,
    html: `
      <p>Hola ${name},</p>
      <p>Tu pago de <strong>${formatPrice(amount)}</strong> para <strong>${planLabel}</strong> (pedido #${reference}) fue aprobado.</p>
      <p>Nos ponemos en contacto en breve para coordinar el arranque del servicio.</p>
      <p>— El equipo de NEXA</p>
    `,
  });

  await sendMail({
    to: CONTACT_EMAIL,
    fromName: 'NEXA Web',
    subject: `Pago aprobado — ${planLabel} (#${reference})`,
    html: `
      <p>Se confirmó el pago de <strong>${formatPrice(amount)}</strong> de <strong>${name}</strong> (${email}) para <strong>${planLabel}</strong>.</p>
      <p>Coordiná el kickoff del servicio con el cliente.</p>
    `,
  });
}
