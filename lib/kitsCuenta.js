import crypto from 'crypto';
import { prisma } from '@/lib/db';

/*
 * Al aprobarse el pago de un kit, el comprador queda con una cuenta de NEXA
 * Aprende (con su mail) y el kit en "Mis recursos".
 *
 * - Si ya tenía cuenta con ese mail, se le suma la compra.
 * - Si no, se crea la cuenta SIN contraseña usable ("pendiente:..." no es un
 *   hash válido, así que nadie puede entrar con ella) y se le manda un enlace
 *   para que cree su propia contraseña (ver lib/kitsAcceso.js).
 * - El pedido se guarda una sola vez por pago de Mercado Pago.
 */
export const CLAVE_PENDIENTE = 'pendiente:';

export async function asegurarCuentaComprador({ email, nombre, kit, paymentId, monto }) {
  const correo = String(email).trim().toLowerCase().slice(0, 200);
  let user = await prisma.user.findUnique({ where: { email: correo } });
  let creada = false;
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: String(nombre || 'Comprador').trim().slice(0, 120) || 'Comprador',
        email: correo,
        passwordHash: CLAVE_PENDIENTE + crypto.randomBytes(24).toString('hex'),
        role: 'USER',
      },
    });
    creada = true;
  }

  const idPago = String(paymentId);
  let pedido = await prisma.order.findFirst({ where: { mpPaymentId: idPago } });
  if (!pedido) {
    pedido = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'APPROVED',
        originalTotal: monto,
        total: monto,
        savings: 0,
        mpPaymentId: idPago,
        payerEmail: correo,
        items: { create: [{ title: kit.titulo, price: monto, qty: 1 }] },
      },
    });
  }

  return { user, creada, pedidoId: pedido.id, necesitaClave: String(user.passwordHash).startsWith(CLAVE_PENDIENTE) };
}
