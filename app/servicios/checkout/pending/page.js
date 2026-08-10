import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Pago pendiente | NEXA' };

export default function ServicioCheckoutPendingPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 640 }}>
          <div className="aprende-auth-card" style={{ textAlign: 'center', maxWidth: 560 }}>
            <Clock3 size={40} color="var(--lilac-deep)" style={{ marginBottom: 12 }} />
            <h1>Tu pago está pendiente</h1>
            <p>Mercado Pago todavía está procesando el pago (por ejemplo, si pagaste con dinero en cuenta o un método que tarda en acreditarse). Te vamos a contactar apenas se confirme.</p>
            <Link href="/servicios" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>
              Volver a Servicios
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
