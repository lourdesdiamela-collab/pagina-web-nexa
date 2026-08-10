import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resolveCartFromDb, applyCoupon, createPendingOrder } from '@/lib/orders';
import { applyTransferDiscount } from '@/lib/pricing';

// Registra un pedido "voy a pagar por transferencia bancaria" con el 10% OFF
// aplicado. No hay verificación automática de pago (no hay integración con el
// banco) — el pedido queda en estado PENDING_TRANSFER hasta que Lu confirma
// manualmente el ingreso desde /aprende/admin/pedidos, lo que dispara el email
// de compra confirmada (misma lógica que Mercado Pago vía approveOrder).
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
  const { total: afterCoupon, coupon, error: couponError } = await applyCoupon(couponCode, totals.total);
  if (couponCode && couponError) {
    return NextResponse.json({ error: couponError }, { status: 400 });
  }

  const finalTotal = applyTransferDiscount(afterCoupon);
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
    status: 'PENDING_TRANSFER',
  });

  return NextResponse.json({ orderId: order.id, total: order.total });
}
