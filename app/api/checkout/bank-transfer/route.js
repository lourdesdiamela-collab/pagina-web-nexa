import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { resolveCartFromDb, applyCoupon, createPendingOrder, normalizarItems } from '@/lib/orders';
import { limitar, ipCliente, MINUTO, HORA } from '@/lib/rateLimit';
import { applyTransferDiscount } from '@/lib/pricing';
import { buildTermsAcceptance } from '@/lib/terms';

// Registra un pedido "voy a pagar por transferencia bancaria" con el 10% OFF
// aplicado. No hay verificación automática de pago (no hay integración con el
// banco) — el pedido queda en estado PENDING_TRANSFER hasta que Lu confirma
// manualmente el ingreso desde /aprende/admin/pedidos, lo que dispara el email
// de compra confirmada (misma lógica que Mercado Pago vía approveOrder).
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Necesitás iniciar sesión para comprar.' }, { status: 401 });
  }

  // Cada pedido crea un registro y manda un mail: tope por cuenta y por IP
  // (compartido entre instancias, ver lib/rateLimit.js).
  const okUsuario = await limitar('pedido-usuario', session.user.id, { maximo: 10, ventanaMs: HORA });
  const okIp = await limitar('pedido-ip', ipCliente(request), { maximo: 10, ventanaMs: 10 * MINUTO });
  if (!okUsuario || !okIp) {
    return NextResponse.json({ error: 'Recibimos muchos pedidos seguidos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));

  // La aceptación de los T&C se valida en el servidor: que el botón esté
  // deshabilitado en el navegador no impide llamar a esta API a mano.
  const { error: termsError, data: termsAcceptance } = buildTermsAcceptance(body, request);
  if (termsError) {
    return NextResponse.json({ error: termsError }, { status: 400 });
  }

  // Cantidad siempre 1, sin repetidos y con tope (ver normalizarItems).
  const items = normalizarItems(body.items);
  if (items.length === 0) {
    return NextResponse.json({ error: 'El carrito está vacío.' }, { status: 400 });
  }

  const { totals, resolvedItems } = await resolveCartFromDb(items);
  if (resolvedItems.length === 0) {
    return NextResponse.json({ error: 'Ninguno de los productos del carrito existe.' }, { status: 400 });
  }

  const couponCode = String(body.couponCode || '').trim().slice(0, 60);
  // Los cupones no se pueden probar por fuerza bruta: tope de intentos por cuenta.
  if (couponCode && !(await limitar('cupon', session.user.id, { maximo: 15, ventanaMs: HORA }))) {
    return NextResponse.json({ error: 'Demasiados intentos con cupones. Probá de nuevo más tarde.' }, { status: 429 });
  }
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
    termsAcceptance,
  });

  return NextResponse.json({ orderId: order.id, total: order.total });
}
