import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Pago pendiente | NEXA Aprende' };

export default function CheckoutPendingPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80 }}>
          <div className="aprende-auth-card" style={{ textAlign: 'center' }}>
            <Clock3 size={40} color="var(--lilac-deep)" style={{ marginBottom: 12 }} />
            <h1>Tu pago está pendiente</h1>
            <p>Mercado Pago todavía está procesando el pago (por ejemplo, si pagaste con efectivo o transferencia). Te avisamos por email apenas se acredite.</p>
            <Link href="/aprende/mis-recursos" className="btn btn-primary" style={{ marginTop: 16, justifyContent: 'center' }}>
              Ver mis recursos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
