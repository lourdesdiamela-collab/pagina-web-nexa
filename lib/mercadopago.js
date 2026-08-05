import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

/*
 * Integración con Mercado Pago (Checkout Pro).
 *
 * PENDIENTE DE LU: sin MP_ACCESS_TOKEN configurado, isMpConfigured() devuelve
 * false y el checkout usa el modo de simulación de pago (solo development,
 * ver /api/checkout/simulate) para poder probar el flujo de principio a fin
 * sin credenciales reales. En cuanto Lu cargue sus credenciales de vendedor
 * en las variables de entorno, el checkout empieza a usar Mercado Pago real
 * automáticamente, sin cambios de código.
 */

export function isMpConfigured() {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

function getClient() {
  if (!isMpConfigured()) throw new Error('Mercado Pago no está configurado (falta MP_ACCESS_TOKEN).');
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export async function createPreference({ orderId, title, total, payerEmail }) {
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
      back_urls: {
        success: `${base}/aprende/checkout/success`,
        failure: `${base}/aprende/checkout/failure`,
        pending: `${base}/aprende/checkout/pending`,
      },
      auto_return: 'approved',
      notification_url: `${base}/api/mercadopago/webhook`,
    },
  });

  return result;
}

export async function getPayment(paymentId) {
  const client = getClient();
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}
