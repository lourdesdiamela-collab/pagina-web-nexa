import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { approveOrder } from '@/lib/orders';
import { isSimulationAllowed } from '@/lib/mercadopago';

/*
 * Simulador de pago aprobado — SOLO ENTORNO DE DESARROLLO.
 *
 * Existe para poder probar el flujo de compra de punta a punta sin
 * credenciales reales de Mercado Pago.
 *
 * El candado es isSimulationAllowed() (ver lib/mercadopago.js), que exige un
 * chequeo explícito de entorno de desarrollo + un opt-in manual
 * (ALLOW_PAYMENT_SIMULATION=true), NO solamente que MP_ACCESS_TOKEN esté
 * vacío. Con el candado viejo (solo token vacío) esta ruta quedaba abierta en
 * producción y permitía que cualquier usuario registrado se aprobara su
 * propio pedido sin pagar.
 *
 * Se responde 404 y no 403 a propósito: fuera de desarrollo la ruta se
 * comporta como si no existiera, sin confirmarle a nadie que el simulador
 * está ahí.
 */
export async function POST(request) {
  if (!isSimulationAllowed()) {
    console.warn('[simulate] Intento de simular un pago con el simulador deshabilitado.');
    return NextResponse.json({ error: 'No encontrado.' }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Necesitás iniciar sesión.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const orderId = String(body.orderId || '');
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: 'Pedido no encontrado.' }, { status: 404 });
  }
  if (order.status !== 'PENDING') {
    return NextResponse.json({ error: 'Este pedido ya fue procesado.' }, { status: 400 });
  }

  await approveOrder(orderId, { mpPaymentId: `SIMULATED-${Date.now()}`, payerEmail: session.user.email });

  return NextResponse.json({ success: true, orderId });
}
