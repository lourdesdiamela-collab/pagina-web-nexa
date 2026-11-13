import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CompraKitClient from './CompraKitClient';
import { kitPorSlug, formatoPrecio } from '@/lib/kits.mjs';
import { isMpConfigured } from '@/lib/mercadopago';
import { waHref } from '@/lib/whatsapp';

export const metadata = {
  title: 'Comprar Kit IA | NEXA',
  description: 'Comprá tu Kit IA con Mercado Pago y recibilo por mail al instante.',
  robots: { index: false, follow: true },
};
export const dynamic = 'force-dynamic';

export default function ComprarKitPage({ searchParams }) {
  const kit = kitPorSlug(String(searchParams?.kit || '')) || kitPorSlug('whatsapp-instagram');
  const mpListo = isMpConfigured();
  const falloPago = searchParams?.pago === 'fallo';

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 980 }}>
          <Link href="/soluciones-ia" style={{ color: '#6B3FD4', fontWeight: 600 }}>← Volver a Kits IA</Link>
          <h1 style={{ margin: '14px 0 6px', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', lineHeight: 1.15 }}>Comprar tu kit</h1>
          <p style={{ margin: '0 0 28px', color: '#3A3E50', fontSize: '1.1rem', lineHeight: 1.6 }}>
            Pagás con Mercado Pago y en cuanto se acredita te llega todo por mail. Sin crear cuenta.
          </p>
          <CompraKitClient
            kit={{ slug: kit.slug, titulo: kit.titulo, precio: kit.precio, precioTexto: formatoPrecio(kit.precio), archivos: kit.archivos.map((a) => a.titulo) }}
            mpListo={mpListo}
            falloPago={falloPago}
            waLink={waHref('kits_ia_comprar', `Hola NEXA! Quiero comprar el kit "${kit.titulo}" (${formatoPrecio(kit.precio)}).`)}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
