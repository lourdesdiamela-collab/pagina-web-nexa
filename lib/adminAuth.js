import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

/*
 * IMPORTANTE: el chequeo del layout de /aprende/admin NO alcanza solo.
 *
 * En la navegación interna de Next (pedidos "RSC"), el navegador le dice al
 * servidor qué layouts ya tiene en pantalla, y el servidor se saltea esos
 * layouts y renderiza solo la página. Mandando ese dato a mano, cualquiera
 * podía ver las páginas del admin (usuarios, pedidos, leads...) sin
 * iniciar sesión. Por eso CADA página del admin llama a requireAdminPage()
 * por su cuenta, y además middleware.js corta /aprende/admin antes de llegar.
 */

function esAdmin(session) {
  return Boolean(session?.user?.id) && session.user.role === 'ADMIN';
}

// Usar en Server Components (layouts/páginas) — redirige si no es admin.
export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  if (!esAdmin(session)) {
    redirect('/aprende/cuenta/login?callbackUrl=/aprende/admin');
  }
  return session;
}

// Usar dentro de Server Actions — nunca confiar en el estado del cliente.
export async function requireAdminAction() {
  const session = await getServerSession(authOptions);
  if (!esAdmin(session)) {
    throw new Error('No autorizado.');
  }
  return session;
}
