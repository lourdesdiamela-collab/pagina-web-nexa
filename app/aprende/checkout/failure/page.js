import Link from 'next/link';
import { XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Pago no completado | NEXA Aprende' };

export default function CheckoutFailurePage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80 }}>
          <div className="aprende-auth-card" style={{ textAlign: 'center' }}>
            <XCircle size={40} color="#b23e63" style={{ marginBottom: 12 }} />
            <h1>El pago no se pudo completar</h1>
            <p>No te preocupes, no se realizó ningún cargo. Podés volver a tu carrito e intentar de nuevo.</p>
            <Link href="/aprende/carrito" className="btn btn-primary" style={{ marginTop: 16, justifyContent: 'center' }}>
              Volver al carrito
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
