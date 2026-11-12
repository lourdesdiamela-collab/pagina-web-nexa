import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { esClaveTemporal } from '@/lib/kitsCuenta';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CambiarClaveForm from './CambiarClaveForm';

export const metadata = { title: 'Elegí tu contraseña | NEXA Aprende', robots: { index: false } };

export default async function CambiarClavePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/aprende/cuenta/login?callbackUrl=/aprende/cuenta/cambiar-clave');
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { passwordHash: true, email: true } });
  const obligatorio = Boolean(user && esClaveTemporal(user.passwordHash));
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 520 }}>
          <div className="aprende-auth-card" style={{ background: '#fff' }}>
            <h1 style={{ color: '#12141D' }}>{obligatorio ? 'Elegí tu contraseña' : 'Cambiar contraseña'}</h1>
            <CambiarClaveForm email={user?.email || ''} obligatorio={obligatorio} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
