import { prisma } from '@/lib/db';
import { listProductsForCart } from '@/lib/catalogQueries';
import { computeCartTotals } from '@/lib/pricing';
import { formatPrice } from '@/lib/products.mjs';
import { sendMail } from '@/lib/mailer';
import { escapar } from '@/lib/seguridad';

/*
 * Normaliza el carrito que manda el navegador. Son productos digitales: la
 * cantidad SIEMPRE es 1 (comprar dos veces el mismo PDF no tiene sentido).
 * Antes la cantidad se aceptaba tal cual: con qty = 1e9 el motor de precios
 * intentaba armar un arreglo de mil millones de lugares y tiraba abajo el
 * servidor, y con cantidades no enteras la base rechazaba el pedido (error 500).
 * También se sacan los repetidos y se pone un tope de productos.
 */
export const MAX_ITEMS_CARRITO = 150;

export function normalizarItems(crudo) {
  if (!Array.isArray(crudo)) return [];
  const vistos = new Set();
  const items = [];
  for (const item of crudo) {
    const slug = typeof item?.slug === 'string' ? item.slug.trim().slice(0, 200) : '';
    if (!slug || vistos.has(slug)) continue;
    vistos.add(slug);
    items.push({ slug, qty: 1 });
    if (items.length >= MAX_ITEMS_CARRITO) break;
  }
  return items;
}

// items: [{ slug, qty }] (ya normalizados con normalizarItems)
export async function resolveCartFromDb(items) {
  const { products, categoryProductCounts } = await listProductsForCart();
  const productsBySlug = new Map(products.map((p) => [p.slug, p]));
  const catalog = {
    productsBySlug,
    categoryProductCounts: new Map(Object.entries(categoryProductCounts)),
    totalProductsCount: products.length,
  };
  const totals = computeCartTotals(items, catalog);
  const resolvedItems = items
    .map((item) => ({ item, product: productsBySlug.get(item.slug) }))
    .filter((r) => r.product);
  return { totals, resolvedItems };
}

export async function applyCoupon(couponCode, total) {
  if (!couponCode) return { total, coupon: null, error: null };
  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } });
  if (!coupon || !coupon.active) return { total, coupon: null, error: 'Cupón inválido.' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { total, coupon: null, error: 'Cupón vencido.' };
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return { total, coupon: null, error: 'Cupón agotado.' };

  const discount = coupon.type === 'PERCENT' ? Math.round((total * coupon.value) / 100) : coupon.value;
  const newTotal = Math.max(0, total - discount);
  return { total: newTotal, coupon, error: null };
}

// status: 'PENDING' (Mercado Pago, esperando pago) | 'PENDING_TRANSFER' (transferencia
// bancaria, esperando que Lu verifique el ingreso a mano desde el panel admin).
export async function createPendingOrder({ userId, resolvedItems, totals, couponCode, status = 'PENDING', termsAcceptance = null }) {
  const order = await prisma.order.create({
    data: {
      userId,
      status,
      originalTotal: totals.originalTotal,
      total: totals.total,
      savings: totals.savings,
      couponCode: couponCode || null,
      // Aceptación de T&C (ver lib/terms.js). Queda pegada al pedido para
      // poder demostrar quién aceptó qué y cuándo.
      ...(termsAcceptance || {}),
      items: {
        create: resolvedItems.map(({ item, product }) => ({
          title: product.title,
          price: product.price,
          qty: item.qty,
          productId: product.id,
        })),
      },
    },
    include: { items: true, user: true },
  });

  // Cualquier compra online registrada (sea cual sea el método de pago elegido)
  // dispara de inmediato un email de "recibimos tu pedido" — pedido explícito de
  // Lu. No bloquea la creación del pedido si el envío falla.
  try {
    await sendOrderReceivedEmail(order);
  } catch (error) {
    console.error('Error enviando email de "pedido recibido":', error);
  }

  return order;
}

/*
 * Aprueba un pedido de forma ATÓMICA: el cambio de estado solo se hace si el
 * pedido todavía no estaba aprobado. Antes el webhook de Mercado Pago y la
 * página de "pago aprobado" podían aprobar el mismo pedido a la vez: salían
 * dos mails de confirmación y el cupón se contaba dos veces.
 *
 * Se puede aprobar desde PENDING, PENDING_TRANSFER o REJECTED (en Mercado
 * Pago, un pago rechazado se puede reintentar y aprobar dentro de la misma
 * preferencia). Devuelve el pedido aprobado, o null si ya estaba aprobado
 * (o no se podía aprobar) y no se hizo nada.
 */
export const ESTADOS_APROBABLES = ['PENDING', 'PENDING_TRANSFER', 'REJECTED', 'CANCELLED'];

export async function approveOrder(orderId, { mpPaymentId, payerEmail, desde = ESTADOS_APROBABLES } = {}) {
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, status: { in: desde } },
    data: { status: 'APPROVED', mpPaymentId: mpPaymentId || undefined, payerEmail: payerEmail || undefined },
  });
  if (count === 0) return null;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true },
  });

  if (order.couponCode) {
    await prisma.coupon.updateMany({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } }).catch(() => {});
  }

  await sendPurchaseConfirmationEmail(order);
  return order;
}

/*
 * Control extra antes de aprobar un pedido de Aprende con un pago de Mercado
 * Pago: el monto acreditado y la moneda tienen que coincidir con el total del
 * pedido. El precio ya lo fija el servidor al crear la preferencia; esto es
 * una red de seguridad por si alguna vez un pago no corresponde al pedido.
 */
export function pagoCoincideConPedido(payment, order) {
  const monto = Number(payment?.transaction_amount);
  // Tolerancia de $1 por redondeos de centavos.
  return Number.isFinite(monto) && Math.abs(monto - Number(order.total)) < 1 && payment?.currency_id === 'ARS';
}

// Estados desde los que un pago de Mercado Pago puede aprobar un pedido.
export const ESTADOS_APROBABLES_MP = ['PENDING', 'REJECTED'];

// Solo se rechaza un pedido que sigue pendiente: un aviso de pago rechazado
// que llega tarde nunca pisa un pedido ya aprobado.
export async function rejectOrder(orderId, { mpPaymentId } = {}) {
  await prisma.order.updateMany({
    where: { id: orderId, status: 'PENDING' },
    data: { status: 'REJECTED', mpPaymentId: mpPaymentId || undefined },
  });
  return prisma.order.findUnique({ where: { id: orderId } });
}

// Mail inmediato al registrarse el pedido (antes de que se confirme el pago).
// Mensaje simple pedido por Lu: "gracias por tu compra, en breve nos
// contactamos para enviarte el material". Se dispara para todo pedido nuevo,
// sea pago con Mercado Pago o transferencia bancaria.
//
// El nombre de la cuenta y los títulos van escapados: el nombre lo escribe
// quien se registra (sin verificar el email), así que sin escapar se podía
// meter HTML (links falsos) en un mail que sale desde la cuenta de NEXA.
async function sendOrderReceivedEmail(order) {
  if (!order.user?.email) return;

  const orderCode = order.id.slice(-8).toUpperCase();
  const itemsHtml = order.items
    .map((i) => `<tr><td style="padding:6px 0;">${escapar(i.title)} × ${i.qty}</td><td style="padding:6px 0;text-align:right;">${formatPrice(i.price * i.qty)}</td></tr>`)
    .join('');

  const isTransfer = order.status === 'PENDING_TRANSFER';

  await sendMail({
    to: order.user.email,
    subject: `¡Recibimos tu pedido! #${orderCode} — NEXA Aprende`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2>¡Gracias por tu compra, ${escapar(order.user.name)}!</h2>
        <p>Ya registramos tu pedido #${orderCode}. En breve nos vamos a contactar con vos para enviarte el material.</p>
        ${isTransfer ? '<p>Recordá completar la transferencia con los datos bancarios que te mostramos en la web — apenas verifiquemos el ingreso, confirmamos tu compra.</p>' : ''}
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
          ${itemsHtml}
          <tr><td style="padding:10px 0 0;font-weight:bold;">Total</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;">${formatPrice(order.total)}</td></tr>
        </table>
        <p style="color:#828699;font-size:12px;margin-top:24px;">NEXA Aprende — Pedido #${orderCode}</p>
      </div>
    `,
  });
}

async function sendPurchaseConfirmationEmail(order) {
  const itemsHtml = order.items
    .map((i) => {
      const downloadNote = i.product?.fileUrl
        ? 'Ya podés descargarlo desde "Mis Recursos" en la web.'
        : 'Vamos a avisarte por acá apenas esté disponible para descargar.';
      return `<tr><td style="padding:8px 0;">${escapar(i.title)} × ${i.qty}<br/><span style="color:#828699;font-size:12px;">${downloadNote}</span></td><td style="padding:8px 0;text-align:right;">${formatPrice(i.price * i.qty)}</td></tr>`;
    })
    .join('');

  const misRecursosUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/aprende/mis-recursos`;

  await sendMail({
    to: order.user.email,
    subject: `¡Compra confirmada! Pedido #${order.id.slice(-8).toUpperCase()} — NEXA Aprende`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2>¡Gracias por tu compra, ${escapar(order.user.name)}!</h2>
        <p>Tu pago fue aprobado y tu pedido ya está listo.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${itemsHtml}
          <tr><td style="padding:12px 0 0;font-weight:bold;">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:bold;">${formatPrice(order.total)}</td></tr>
        </table>
        <p style="margin-top:24px;">
          <a href="${misRecursosUrl}" style="background:#0D0E15;color:#fff;padding:12px 24px;border-radius:100px;text-decoration:none;font-weight:bold;">Ver mis recursos</a>
        </p>
        <p style="color:#828699;font-size:12px;margin-top:24px;">NEXA Aprende — Pedido #${order.id.slice(-8).toUpperCase()}</p>
      </div>
    `,
  });
}
