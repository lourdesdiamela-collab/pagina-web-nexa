import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';

// Usar en Server Components (layouts/páginas) — redirige si no es admin.
export async function requireAdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/aprende/cuenta/login?callbackUrl=/aprende/admin');
  }
  return session;
}

// Usar dentro de Server Actions — nunca confiar en el estado del cliente.
export async function requireAdminAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('No autorizado.');
  }
  return session;
}
