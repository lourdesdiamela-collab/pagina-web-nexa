import crypto from 'crypto';
import bcrypt from 'bcryptjs';
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
// Contraseña provisoria: el hash guardado lleva este prefijo y, mientras lo
// tenga, la persona debe cambiarla al entrar (ver /aprende/cuenta/cambiar-clave).
export const CLAVE_TEMPORAL = 'temp$';

export function esClaveTemporal(hash) {
  return String(hash || '').startsWith(CLAVE_TEMPORAL);
}

// Sin caracteres que se confunden (0/O, 1/l/I).
export function generarClaveTemporal() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(10);
  let c = '';
  for (let i = 0; i < 10; i++) c += letras[bytes[i] % letras.length];
  return c.slice(0, 5) + '-' + c.slice(5);
}

export async function asegurarCuentaComprador({ email, nombre, kit, paymentId, monto }) {
  const correo = String(email).trim().toLowerCase().slice(0, 200);
  let user = await prisma.user.findUnique({ where: { email: correo } });
  let creada = false;
  let claveTemporal = null;
  if (!user) {
    claveTemporal = generarClaveTemporal();
    user = await prisma.user.create({
      data: {
        name: String(nombre || 'Comprador').trim().slice(0, 120) || 'Comprador',
        email: correo,
        passwordHash: CLAVE_TEMPORAL + (await bcrypt.hash(claveTemporal, 10)),
        role: 'USER',
      },
    });
    creada = true;
  } else if (String(user.passwordHash).startsWith(CLAVE_PENDIENTE)) {
    // Cuenta sin contraseña usable: se le da una provisoria.
    claveTemporal = generarClaveTemporal();
    user = await prisma.user.update({ where: { id: user.id }, data: { passwordHash: CLAVE_TEMPORAL + (await bcrypt.hash(claveTemporal, 10)) } });
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

  return { user, creada, pedidoId: pedido.id, claveTemporal, necesitaClave: Boolean(claveTemporal) };
}
