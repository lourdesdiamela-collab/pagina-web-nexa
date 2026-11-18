import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendMail } from '@/lib/mailer';
import { permitidoPorIp, emailUnico, EMAIL_VALIDO, escapar } from '@/lib/seguridad';
import { limitar, ipCliente, HORA } from '@/lib/rateLimit';
import { crearTokenClave, urlCrearClave } from '@/lib/kitsAcceso';

/*
 * "Olvidé mi contraseña" de NEXA Aprende.
 * Manda por mail un enlace de un solo uso (vale 1 día) para elegir una
 * contraseña nueva. Responde SIEMPRE lo mismo exista o no la cuenta, para que
 * nadie pueda averiguar qué mails están registrados.
 */
const RESPUESTA = { ok: true, mensaje: 'Si ese mail tiene una cuenta, te enviamos un enlace para elegir una contraseña nueva. Revisá también la carpeta de spam.' };

export async function POST(request) {
  if (!permitidoPorIp(request, 'olvide-clave', { maximo: 6 }) || !(await limitar('olvide-clave', ipCliente(request), { maximo: 10, ventanaMs: HORA }))) {
    return NextResponse.json({ error: 'Demasiados intentos. Probá de nuevo en unos minutos.' }, { status: 429 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const email = emailUnico(body?.email);
    if (!email || !EMAIL_VALIDO.test(email)) {
      return NextResponse.json({ error: 'Revisá tu email: parece que tiene un error.' }, { status: 400 });
    }
    if (!(await limitar('olvide-clave-destino', email, { maximo: 3, ventanaMs: HORA }))) {
      return NextResponse.json(RESPUESTA);
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = crearTokenClave({ email: user.email, passwordHash: user.passwordHash, dias: 1 });
      const url = urlCrearClave(token);
      await sendMail({
        to: user.email,
        fromName: 'NEXA',
        subject: 'Elegí una contraseña nueva para tu cuenta de NEXA',
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#12141D;line-height:1.6">
            <h2 style="margin:0 0 8px">Hola${user.name ? ', ' + escapar(String(user.name).split(' ')[0]) : ''}</h2>
            <p>Pediste cambiar tu contraseña de NEXA Aprende. Tocá el botón para elegir una nueva:</p>
            <p style="margin:24px 0"><a href="${url}" style="background:#D2F23A;color:#12141D;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:700;display:inline-block">Elegir contraseña nueva</a></p>
            <p style="font-size:14px;color:#505466">El enlace sirve una sola vez y vence en 24 horas. Si no lo pediste vos, ignorá este mail: tu contraseña actual sigue igual.</p>
            <p style="font-size:14px;color:#505466">Si el botón no anda, copiá y pegá esta dirección en tu navegador:<br>${url}</p>
            <p>— El equipo de NEXA</p>
          </div>`,
      });
    }
    return NextResponse.json(RESPUESTA);
  } catch (e) {
    console.error('POST /api/aprende/olvide-clave:', e);
    return NextResponse.json({ error: 'No pudimos procesar el pedido. Probá de nuevo en unos minutos.' }, { status: 500 });
  }
}
