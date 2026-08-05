import { prisma } from '@/lib/db';
import { listProductsForCart } from '@/lib/catalogQueries';
import { computeCartTotals } from '@/lib/pricing';
import { formatPrice } from '@/lib/products.mjs';
import { sendMail } from '@/lib/mailer';

// items: [{ slug, qty }]
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

export async function createPendingOrder({ userId, resolvedItems, totals, couponCode }) {
  const order = await prisma.order.create({
    data: {
      userId,
      status: 'PENDING',
      originalTotal: totals.originalTotal,
      total: totals.total,
      savings: totals.savings,
      couponCode: couponCode || null,
      items: {
        create: resolvedItems.map(({ item, product }) => ({
          title: product.title,
          price: product.price,
          qty: item.qty,
          productId: product.id,
        })),
      },
    },
    include: { items: true },
  });
  return order;
}

export async function approveOrder(orderId, { mpPaymentId, payerEmail } = {}) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'APPROVED', mpPaymentId: mpPaymentId || undefined, payerEmail: payerEmail || undefined },
    include: { items: { include: { product: true } }, user: true },
  });

  if (order.couponCode) {
    await prisma.coupon.updateMany({ where: { code: order.couponCode }, data: { usedCount: { increment: 1 } } }).catch(() => {});
  }

  await sendPurchaseConfirmationEmail(order);
  return order;
}

export async function rejectOrder(orderId, { mpPaymentId } = {}) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'REJECTED', mpPaymentId: mpPaymentId || undefined },
  });
}

async function sendPurchaseConfirmationEmail(order) {
  const itemsHtml = order.items
    .map((i) => {
      const downloadNote = i.product?.fileUrl
        ? 'Ya podés descargarlo desde "Mis Recursos" en la web.'
        : 'Vamos a avisarte por acá apenas esté disponible para descargar.';
      return `<tr><td style="padding:8px 0;">${i.title} × ${i.qty}<br/><span style="color:#828699;font-size:12px;">${downloadNote}</span></td><td style="padding:8px 0;text-align:right;">${formatPrice(i.price * i.qty)}</td></tr>`;
    })
    .join('');

  const misRecursosUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/aprende/mis-recursos`;

  await sendMail({
    to: order.user.email,
    subject: `¡Compra confirmada! Pedido #${order.id.slice(-8).toUpperCase()} — NEXA Aprende`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2>¡Gracias por tu compra, ${order.user.name}!</h2>
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
