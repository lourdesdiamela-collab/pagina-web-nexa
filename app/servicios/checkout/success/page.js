import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Pago recibido | NEXA' };

// Página de vuelta simple: a diferencia de Aprende, acá no hay Order en la
// base de datos para consultar el estado real del pago (ver
// SERVICIOS_CHECKOUT.md), así que no repetimos la verificación contra la API
// de Mercado Pago acá — la confirmación real y el email de "pago aprobado"
// los dispara el webhook (app/api/mercadopago/webhook/route.js) usando la
// metadata de la preferencia.
export default async function ServicioCheckoutSuccessPage({ searchParams }) {
  const sp = await searchParams;
  const reference = sp?.external_reference;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 640 }}>
          <div className="aprende-auth-card" style={{ textAlign: 'center', maxWidth: 560 }}>
            <CheckCircle2 size={40} color="#5c6a12" style={{ marginBottom: 12 }} />
            <h1>¡Pago recibido!</h1>
            <p>
              {reference ? `Tu pedido #${String(reference).slice(-8)} ` : 'Tu pedido '}
              está siendo confirmado. En cuanto Mercado Pago verifique el pago te vamos a contactar para coordinar el arranque del servicio.
            </p>
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
