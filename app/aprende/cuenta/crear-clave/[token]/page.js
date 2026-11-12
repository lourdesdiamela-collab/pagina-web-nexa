import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/db';
import { leerTokenClave, huellaClave } from '@/lib/kitsAcceso';
import { waHref } from '@/lib/whatsapp';
import { estiloTarjeta } from '@/components/KitDescargas';
import CrearClaveForm from './CrearClaveForm';

export const metadata = { title: 'Creá tu contraseña | NEXA', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function CrearClavePage({ params }) {
  const { token } = await params;
  const datos = leerTokenClave(decodeURIComponent(token));
  let email = null;
  if (datos) {
    const user = await prisma.user.findUnique({ where: { email: datos.email } });
    if (user && huellaClave(user.passwordHash) === datos.huella) email = user.email;
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 520 }}>
          <div style={estiloTarjeta}>
            {email ? (
              <CrearClaveForm token={decodeURIComponent(token)} email={email} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', margin: '0 0 8px', color: '#12141D' }}>Este enlace no sirve</h1>
                <p style={{ color: '#3A3E50', lineHeight: 1.6 }}>Venció o ya lo usaste. Si ya creaste tu contraseña, entrá con tu mail. Si no la recordás, escribinos y te mandamos uno nuevo.</p>
                <a className="btn btn-primary" href="/aprende/cuenta/login?callbackUrl=%2Faprende%2Fmis-recursos" style={{ margin: '8px 6px 0' }}>Entrar</a>
                <a className="btn btn-outline" href={waHref('crear_clave_invalido', 'Hola NEXA! Necesito un nuevo enlace para crear la contraseña de mi cuenta.')} rel="noopener" style={{ margin: '8px 6px 0' }}>Escribir por WhatsApp</a>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
