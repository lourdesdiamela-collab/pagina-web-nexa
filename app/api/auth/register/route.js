import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { permitidoPorIp } from '@/lib/seguridad';
import { limitar, ipCliente, HORA } from '@/lib/rateLimit';

export async function POST(request) {
  if (!permitidoPorIp(request, 'registro', { maximo: 10 })) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }
  // Segunda capa, compartida entre instancias (ver lib/rateLimit.js).
  if (!(await limitar('registro', ipCliente(request), { maximo: 10, ventanaMs: HORA }))) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }
  try {
    const body = await request.json();
    const name = String(body.name || '').trim().slice(0, 120);
    const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
    const password = String(body.password || '');

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 200) {
      return NextResponse.json({ error: 'La contraseña debe tener entre 8 y 200 caracteres.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Ya existe una cuenta con ese email.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: 'USER' },
    });

    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('POST /api/auth/register error:', error);
    return NextResponse.json({ error: 'No pudimos crear tu cuenta.' }, { status: 500 });
  }
}
