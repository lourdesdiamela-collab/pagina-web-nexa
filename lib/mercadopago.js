import crypto from 'crypto';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

/*
 * Integración con Mercado Pago (Checkout Pro).
 *
 * PENDIENTE DE LU: sin MP_ACCESS_TOKEN configurado, isMpConfigured() devuelve
 * false y el checkout NO ofrece pago con tarjeta: le muestra al usuario un
 * aviso de que el pago online no está disponible por el momento y lo deriva a
 * transferencia bancaria. En cuanto Lu cargue sus credenciales de vendedor en
 * las variables de entorno, el checkout empieza a usar Mercado Pago real
 * automáticamente, sin cambios de código.
 */

export function isMpConfigured() {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

/*
 * Candado del simulador de pago (/api/checkout/simulate).
 *
 * IMPORTANTE: antes el único candado era la ausencia de MP_ACCESS_TOKEN, lo
 * que dejaba el simulador ABIERTO EN PRODUCCIÓN mientras Mercado Pago no
 * estuviera configurado — cualquier usuario registrado podía aprobarse su
 * propio pedido y llevarse el producto gratis. Ahora se exige, además del
 * token vacío, un chequeo explícito de entorno de desarrollo:
 *
 *   - NODE_ENV === 'development'  (en `next build` / `next start` y en Vercel
 *     siempre vale 'production', así que esto por sí solo ya cierra prod)
 *   - VERCEL_ENV distinto de 'production' y 'preview' (cinturón y tiradores:
 *     un deploy de Vercel nunca corre con NODE_ENV=development, pero si
 *     alguien fuerza la variable a mano, esto lo sigue frenando)
 *   - ALLOW_PAYMENT_SIMULATION === 'true' (opt-in manual y explícito: hay que
 *     escribirlo a propósito en el .env.local de la máquina de desarrollo)
 *
 * Los tres tienen que dar verdadero. Si falta cualquiera, el simulador no
 * existe: ni se renderiza el botón ni el endpoint acepta pedidos.
 */
export function isSimulationAllowed() {
  if (process.env.NODE_ENV !== 'development') return false;
  if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') return false;
  if (process.env.ALLOW_PAYMENT_SIMULATION !== 'true') return false;
  // Si ya hay credenciales reales, se usa Mercado Pago de verdad.
  if (isMpConfigured()) return false;
  return true;
}

function getClient() {
  if (!isMpConfigured()) throw new Error('Mercado Pago no está configurado (falta MP_ACCESS_TOKEN).');
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function createPreference({ orderId, title, total, payerEmail, backUrls, metadata }) {
  const client = getClient();
  const preference = new Preference(client);
  const base = siteUrl();

  const result = await preference.create({
    body: {
      items: [
        {
          id: orderId,
          title: title || `Pedido NEXA Aprende #${orderId.slice(-8).toUpperCase()}`,
          quantity: 1,
          currency_id: 'ARS',
          unit_price: total,
        },
      ],
      payer: payerEmail ? { email: payerEmail } : undefined,
      external_reference: orderId,
      back_urls: backUrls || {
        success: `${base}/aprende/checkout/success`,
        failure: `${base}/aprende/checkout/failure`,
        pending: `${base}/aprende/checkout/pending`,
      },
      auto_return: 'approved',
      notification_url: `${base}/api/mercadopago/webhook`,
      // metadata viaja pegada a la preferencia y vuelve intacta en el objeto
      // Payment cuando Mercado Pago llama al webhook — la usamos para el
      // checkout de servicios (que no tiene una orden en base de datos como
      // Aprende) para poder mandar el email de confirmación sin necesitar
      // una tabla nueva. Ver app/api/checkout/servicio-preference/route.js.
      metadata: metadata || undefined,
    },
  });

  return result;
}

export async function getPayment(paymentId) {
  const client = getClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

/*
 * Validación de la firma del webhook de Mercado Pago.
 *
 * MP manda dos headers: `x-signature` (con formato "ts=<timestamp>,v1=<hash>")
 * y `x-request-id`. El hash es un HMAC-SHA256 sobre el manifest
 * "id:<data.id>;request-id:<x-request-id>;ts:<ts>;" firmado con la clave
 * secreta del webhook (MP_WEBHOOK_SECRET, se genera en el panel de MP).
 *
 * Devuelve:
 *   'valid'    -> la firma verifica
 *   'invalid'  -> hay secreto configurado pero la firma no verifica (descartar)
 *   'skipped'  -> no hay MP_WEBHOOK_SECRET cargado, no se puede validar
 *
 * Nota: aunque no se valide la firma, el webhook no confía en el body: va a
 * buscar el pago real a la API de Mercado Pago antes de aprobar nada. La firma
 * es una capa extra para no gastar llamadas en notificaciones falsas.
 */
export function verifyWebhookSignature({ signatureHeader, requestIdHeader, dataId }) {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return 'skipped';
  if (!signatureHeader || !dataId) return 'invalid';

  const parts = String(signatureHeader)
    .split(',')
    .map((p) => p.trim().split('='))
    .reduce((acc, [k, v]) => (k && v ? { ...acc, [k]: v } : acc), {});

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return 'invalid';

  const manifest = `id:${String(dataId).toLowerCase()};request-id:${requestIdHeader || ''};ts:${ts};`;
  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(v1, 'utf8');
  if (a.length !== b.length) return 'invalid';
  return crypto.timingSafeEqual(a, b) ? 'valid' : 'invalid';
}
