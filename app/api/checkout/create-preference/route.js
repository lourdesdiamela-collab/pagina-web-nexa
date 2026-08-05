import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { resolveCartFromDb, applyCoupon, createPendingOrder } from '@/lib/orders';
import { isMpConfigured, createPreference } from '@/lib/mercadopago';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Necesitás iniciar sesión para comprar.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? body.items.filter((i) => i?.slug && i?.qty > 0) : [];
  if (items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
  }

  const { totals, resolvedItems } = await resolveCartFromDb(items);
  if (resolvedItems.length === 0) {
    return NextResponse.json({ error: 'Ninguno de los productos del carrito existe.' }, { status: 400 });
  }

  const couponCode = String(body.couponCode || '').trim();
  const { total: finalTotal, coupon, error: couponError } = await applyCoupon(couponCode, totals.total);
  if (couponCode && couponError) {
    return NextResponse.json({ error: couponError }, { status: 400 });
  }

  const finalTotals = {
    ...totals,
    total: finalTotal,
    savings: totals.originalTotal - finalTotal,
  };

  const order = await createPendingOrder({
    userId: session.user.id,
    resolvedItems,
    totals: finalTotals,
    couponCode: coupon ? coupon.code : null,
  });

  if (!isMpConfigured()) {
    return NextResponse.json({
      orderId: order.id,
      mpConfigured: false,
      total: order.total,
    });
  }

  try {
    const preference = await createPreference({
      orderId: order.id,
      title: `Pedido NEXA Aprende #${order.id.slice(-8).toUpperCase()}`,
      total: order.total,
      payerEmail: session.user.email,
    });
    await prisma.order.update({ where: { id: order.id }, data: { mpPreferenceId: preference.id } });
    return NextResponse.json({
      orderId: order.id,
      mpConfigured: true,
      initPoint: preference.init_point,
    });
  } catch (error) {
    console.error('Error creando preferencia de Mercado Pago:', error);
    return NextResponse.json({ error: 'No pudimos iniciar el pago con Mercado Pago.' }, { status: 500 });
  }
}
