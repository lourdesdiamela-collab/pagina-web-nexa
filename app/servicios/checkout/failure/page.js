import Link from 'next/link';
import { XCircle, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Pago no procesado | NEXA' };

export default function ServicioCheckoutFailurePage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 640 }}>
          <div className="aprende-auth-card" style={{ textAlign: 'center', maxWidth: 560 }}>
            <XCircle size={40} color="#b23e63" style={{ marginBottom: 12 }} />
            <h1>El pago no se pudo procesar</h1>
            <p>No te preocupes, no se te cobró nada. Podés volver a intentarlo o pagar por transferencia bancaria.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <Link href="/servicios" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Volver a intentar
              </Link>
              <a href="https://wa.me/5491124527402" target="_blank" rel="noopener noreferrer" className="btn-wa" style={{ width: '100%', justifyContent: 'center' }}>
                <MessageCircle size={16} /> Coordinar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
