import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { limitar, ipCliente, HORA } from '@/lib/rateLimit';
import { esClaveTemporal } from '@/lib/kitsCuenta';

// Cambio de contraseña de quien está logueado (obligatorio con clave provisoria).
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Necesitás iniciar sesión.' }, { status: 401 });
  if (!(await limitar('cambiar-clave', `${session.user.id}:${ipCliente(request)}`, { maximo: 10, ventanaMs: HORA }))) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá más tarde.' }, { status: 429 });
  }
  try {
    const body = await request.json();
    const actual = String(body.actual || '');
    const nueva = String(body.nueva || '');
    if (nueva.length < 8 || nueva.length > 200) {
      return NextResponse.json({ error: 'La contraseña nueva debe tener entre 8 y 200 caracteres.' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: 'Cuenta no encontrada.' }, { status: 404 });
    const guardado = esClaveTemporal(user.passwordHash) ? user.passwordHash.slice(5) : user.passwordHash;
    if (!(await bcrypt.compare(actual, guardado))) {
      return NextResponse.json({ error: 'La contraseña actual no es correcta.' }, { status: 400 });
    }
    if (actual === nueva) {
      return NextResponse.json({ error: 'La contraseña nueva tiene que ser distinta de la provisoria.' }, { status: 400 });
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(nueva, 10) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/aprende/cambiar-clave:', e);
    return NextResponse.json({ error: 'No pudimos guardar tu contraseña. Probá de nuevo.' }, { status: 500 });
  }
}
