import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KitDescargas, { estiloTarjeta } from '@/components/KitDescargas';
import { leerTokenKit } from '@/lib/kitsAcceso';
import { kitPorSlug } from '@/lib/kits.mjs';
import { waHref } from '@/lib/whatsapp';

export const metadata = { title: 'Tu kit | NEXA', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function DescargarKitPage({ params }) {
  const { token } = await params;
  const acceso = leerTokenKit(decodeURIComponent(token));
  const kit = acceso ? kitPorSlug(acceso.kit) : null;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 760 }}>
          {kit ? (
            <>
              <p style={{ color: '#835CE6', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.85rem', margin: '0 0 8px' }}>Tu Kit IA</p>
              <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', lineHeight: 1.15 }}>{kit.titulo}</h1>
              <p style={{ margin: '0 0 24px', color: '#505466', fontSize: '1.05rem', lineHeight: 1.6 }}>
                Acá están tus archivos. Guardá este enlace: podés volver cuando quieras (sirve unos 60 días).
              </p>
              <KitDescargas kit={kit} token={decodeURIComponent(token)} />
              <div style={{ ...estiloTarjeta, marginTop: 24, background: '#F3EEF8', boxShadow: 'none' }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#12141D' }}>Por dónde empezar</p>
                <p style={{ margin: '6px 0 0', color: '#3A3E50', lineHeight: 1.6 }}>
                  Mirá el video de bienvenida y abrí la guía interactiva. Empezá por la parte 1 y andá en orden: cada parte tiene textos listos para copiar.
                </p>
              </div>
              <p style={{ marginTop: 20, color: '#505466', fontSize: '0.95rem', lineHeight: 1.6 }}>
                ¿Algo no se abre o tenés una duda?{' '}
                <a href={waHref('kit_descarga', 'Hola NEXA! Necesito ayuda con mi kit.')} style={{ color: '#6B3FD4', fontWeight: 600 }}>Escribinos por WhatsApp</a>.
              </p>
            </>
          ) : (
            <div style={{ ...estiloTarjeta, textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.6rem', margin: '0 0 8px' }}>Este enlace no es válido o venció</h1>
              <p style={{ color: '#505466', lineHeight: 1.6 }}>
                Si ya compraste tu kit, escribinos con el email de la compra y te mandamos un enlace nuevo.
              </p>
              <a className="btn btn-primary" href={waHref('kit_enlace_vencido', 'Hola NEXA! Mi enlace del kit no funciona. Compré con este email: ')} style={{ marginTop: 12 }}>Escribir por WhatsApp</a>
              <div style={{ marginTop: 12 }}><Link href="/soluciones-ia" style={{ color: '#6B3FD4' }}>Volver a Kits IA</Link></div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
