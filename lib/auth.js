import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { limitar, MINUTO } from '@/lib/rateLimit';

/*
 * Secreto de sesión de NextAuth, sin necesidad de configurar variables.
 *
 * NextAuth necesita un secreto para firmar las sesiones. Si falta, en
 * producción directamente no arranca el login.
 *
 * NO se puede dejar un secreto escrito en el código: este repositorio es
 * público, y cualquiera que lo leyera podría falsificar sesiones y entrar como
 * administrador.
 *
 * Solución: si NEXTAUTH_SECRET está definida, se usa esa (es lo ideal). Si no,
 * se genera una clave aleatoria la primera vez y se guarda en
 * .nexa/auth-secret, que está fuera del control de versiones. Así el sitio
 * arranca solo, sin cargar nada a mano, y el secreto nunca llega al repo.
 *
 * LIMITACIÓN, para tenerla presente: en un hosting sin disco persistente
 * (Vercel y similares) ese archivo no sobrevive entre despliegues, así que
 * cada deploy cierra las sesiones abiertas y hay que volver a iniciar sesión.
 * Para evitarlo hay que cargar NEXTAUTH_SECRET en el panel del hosting.
 */
function resolveAuthSecret() {
  if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
  // En Vercel no se intenta escribir el disco: ver exigirSecretoEnProduccion().
  if (process.env.VERCEL === '1') return crypto.randomBytes(32).toString('base64');

  try {
    const dir = path.join(process.cwd(), '.nexa');
    const file = path.join(dir, 'auth-secret');

    if (fs.existsSync(file)) {
      const guardado = fs.readFileSync(file, 'utf8').trim();
      if (guardado) return guardado;
    }

    const nuevo = crypto.randomBytes(32).toString('base64');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, nuevo, { mode: 0o600 });
    console.warn(
      '[auth] NEXTAUTH_SECRET no está definida. Se generó una clave de sesión y se guardó en .nexa/auth-secret (fuera de git).\n' +
      '       En un hosting sin disco persistente, cargá NEXTAUTH_SECRET para que las sesiones no se corten en cada deploy.',
    );
    return nuevo;
  } catch (error) {
    // Último recurso: una clave en memoria. El sitio arranca igual, pero las
    // sesiones se invalidan cada vez que se reinicia el servidor.
    console.error(
      '[auth] No se pudo leer ni escribir .nexa/auth-secret. Se usa una clave temporal en memoria: ' +
      'las sesiones se van a cerrar al reiniciar el servidor.',
      error,
    );
    return crypto.randomBytes(32).toString('base64');
  }
}

const AUTH_SECRET = resolveAuthSecret();

/*
 * En Vercel NEXTAUTH_SECRET es obligatoria. Sin ella, cada instancia del
 * servidor inventaba su propia clave en memoria (el disco no se puede
 * escribir), así que las sesiones se cortaban al azar. Ahora se corta con un
 * error claro, pero RECIÉN AL ATENDER UN PEDIDO: durante `next build` no se
 * tira nada, para que el build de Vercel no se rompa.
 */
function exigirSecretoEnProduccion() {
  if (process.env.NEXTAUTH_SECRET) return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;
  if (process.env.VERCEL === '1') {
    throw new Error('[auth] Falta NEXTAUTH_SECRET en las variables de entorno de Vercel. Sin ella no se pueden firmar sesiones.');
  }
}

// IP del pedido de login. NextAuth le pasa a authorize() un objeto con los
// headers como objeto plano (o, según la versión, como Headers).
function ipDelLogin(req) {
  const h = req?.headers;
  const leer = (nombre) => (typeof h?.get === 'function' ? h.get(nombre) : h?.[nombre]) || '';
  return String(leer('x-real-ip')).trim() || String(leer('x-forwarded-for')).split(',')[0].trim() || 'desconocida';
}

// Cada cuánto se vuelve a leer el rol del usuario desde la base (así sacarle
// el rol de admin a alguien, o borrar su cuenta, tiene efecto en minutos y
// no recién cuando vence la sesión).
const REVISAR_ROL_CADA_MS = 5 * 60 * 1000;

export const authOptions = {
  // 7 días (antes 30, el valor por defecto de NextAuth).
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  pages: {
    signIn: '/aprende/cuenta/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = String(credentials?.email || '').trim().toLowerCase().slice(0, 200);
        const password = String(credentials?.password || '');
        if (!email || !password || password.length > 200) return null;

        // Freno a la fuerza bruta: por IP y por cuenta (ver lib/rateLimit.js).
        // Se responde igual que con una contraseña incorrecta.
        const ip = ipDelLogin(req);
        const okIp = await limitar('login-ip', ip, { maximo: 20, ventanaMs: 15 * MINUTO });
        const okEmail = await limitar('login-email', email, { maximo: 10, ventanaMs: 15 * MINUTO });
        if (!okIp || !okEmail) {
          console.warn('[auth] Demasiados intentos de login — se rechaza sin chequear la contraseña.');
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rolRevisado = Date.now();
        return token;
      }
      if (token.id && Date.now() - (token.rolRevisado || 0) > REVISAR_ROL_CADA_MS) {
        try {
          const actual = await prisma.user.findUnique({ where: { id: token.id }, select: { role: true } });
          if (!actual) {
            // La cuenta ya no existe: la sesión queda sin usuario (todas las
            // rutas exigen session.user.id).
            token.id = null;
            token.role = null;
          } else {
            token.role = actual.role;
          }
          token.rolRevisado = Date.now();
        } catch (error) {
          // Si la base no responde se mantiene el rol que ya tenía.
          console.error('[auth] No se pudo revisar el rol del usuario:', error?.message || error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id || null;
        session.user.role = token.role || null;
      }
      return session;
    },
  },
  // Getter: NextAuth lee el secreto al atender cada pedido, no al compilar.
  get secret() {
    exigirSecretoEnProduccion();
    return AUTH_SECRET;
  },
};
