import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

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

export const authOptions = {
  session: { strategy: 'jwt' },
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
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;

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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: AUTH_SECRET,
};
