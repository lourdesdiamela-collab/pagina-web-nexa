import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { permitidoPorIp } from '@/lib/seguridad';
import { limitar, ipCliente, HORA } from '@/lib/rateLimit';
import { leerTokenClave, huellaClave } from '@/lib/kitsAcceso';

// Guarda la contraseña que eligió el comprador, con el enlace que le llegó por mail.
export async function POST(request) {
  if (!permitidoPorIp(request, 'crear-clave', { maximo: 10 }) || !(await limitar('crear-clave', ipCliente(request), { maximo: 20, ventanaMs: HORA }))) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }
  try {
    const body = await request.json();
    const password = String(body.password || '');
    if (password.length < 8 || password.length > 200) {
      return NextResponse.json({ error: 'La contraseña debe tener entre 8 y 200 caracteres.' }, { status: 400 });
    }
    const datos = leerTokenClave(body.token);
    if (!datos) return NextResponse.json({ error: 'El enlace no es válido o venció. Escribinos y te mandamos uno nuevo.' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: datos.email } });
    if (!user || huellaClave(user.passwordHash) !== datos.huella) {
      return NextResponse.json({ error: 'Este enlace ya se usó. Si no recordás tu contraseña, escribinos.' }, { status: 400 });
    }
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 10) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('POST /api/aprende/crear-clave:', e);
    return NextResponse.json({ error: 'No pudimos guardar tu contraseña. Probá de nuevo.' }, { status: 500 });
  }
}
