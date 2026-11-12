import Link from 'next/link';
import { CheckCircle2, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KitDescargas, { estiloTarjeta } from '@/components/KitDescargas';
import { isMpConfigured, getPayment } from '@/lib/mercadopago';
import { kitPorSlug } from '@/lib/kits.mjs';
import { crearTokenKit, urlDescargaKit } from '@/lib/kitsAcceso';
import { waHref } from '@/lib/whatsapp';

export const metadata = { title: 'Gracias por tu compra | NEXA', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

// Página a la que vuelve Mercado Pago. Verifica el pago contra la API de MP
// (no confía en lo que viene en la dirección) y, si está aprobado, muestra los
// archivos al instante. El mail con el mismo enlace lo manda el webhook.
// Hacen falta el id del pago Y la referencia del pedido (que solo conoce quien compró).
async function verificarCompra(sp) {
  const paymentId = String(sp?.payment_id || sp?.collection_id || '').replace(/[^0-9]/g, '');
  const referencia = String(sp?.external_reference || '');
  if (!paymentId || !referencia || !isMpConfigured()) return { estado: 'desconocido' };
  try {
    const pago = await getPayment(paymentId);
    if (pago?.external_reference !== referencia || pago?.metadata?.kind !== 'kit') return { estado: 'desconocido' };
    const kit = kitPorSlug(pago.metadata.kit);
    if (!kit) return { estado: 'desconocido' };
    if (pago.status === 'approved' && Number(pago.transaction_amount) === kit.precio) {
      return { estado: 'aprobado', kit, email: pago.metadata.email, token: crearTokenKit({ referencia, kit: kit.slug }) };
    }
    if (pago.status === 'pending' || pago.status === 'in_process') return { estado: 'pendiente', kit, email: pago.metadata.email };
    return { estado: 'desconocido' };
  } catch (e) {
    console.error('[kits/gracias] No se pudo verificar el pago:', e?.message || e);
    return { estado: 'desconocido' };
  }
}

export default async function KitGraciasPage({ searchParams }) {
  const sp = await searchParams;
  const r = await verificarCompra(sp);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80, maxWidth: 760 }}>
          {r.estado === 'aprobado' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <CheckCircle2 size={44} color="#5c6a12" />
                <h1 style={{ margin: '10px 0 6px', fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}>¡Gracias por tu compra!</h1>
                <p style={{ margin: 0, color: '#505466', fontSize: '1.05rem', lineHeight: 1.6 }}>
                  Tu pago fue aprobado. También te mandamos estos archivos por mail{r.email ? ` a ${r.email}` : ''}. Si no lo ves en unos minutos, mirá en spam.
                </p>
              </div>
              <KitDescargas kit={r.kit} token={r.token} />
              <div style={{ ...estiloTarjeta, marginTop: 18, padding: 18 }}>
                <p style={{ margin: 0, color: '#12141D', lineHeight: 1.6 }}>
                  <strong>También te creamos una cuenta</strong> con tu mail. Revisá tu correo: ahí está el enlace para elegir tu contraseña. Después entrás desde{' '}
                  <Link href="/aprende/cuenta/login?callbackUrl=%2Faprende%2Fmis-recursos" style={{ color: '#6B3FD4', fontWeight: 700 }}>Mis recursos</Link> y tus kits quedan guardados ahí.
                </p>
              </div>
              <p style={{ marginTop: 16, color: '#505466', fontSize: '0.95rem' }}>
                Enlace para guardar: <a href={urlDescargaKit(r.token)} style={{ color: '#6B3FD4', wordBreak: 'break-all' }}>{urlDescargaKit(r.token)}</a>
              </p>
            </>
          )}
          {r.estado === 'pendiente' && (
            <div style={{ ...estiloTarjeta, textAlign: 'center' }}>
              <Clock size={40} color="#835CE6" />
              <h1 style={{ fontSize: '1.7rem', margin: '10px 0 6px' }}>Estamos esperando la confirmación del pago</h1>
              <p style={{ color: '#505466', lineHeight: 1.6 }}>
                Cuando Mercado Pago lo acredite te mandamos el kit por mail{r.email ? ` a ${r.email}` : ''}. Puede tardar unos minutos, o hasta un día si pagaste en efectivo.
              </p>
            </div>
          )}
          {r.estado === 'desconocido' && (
            <div style={{ ...estiloTarjeta, textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.7rem', margin: '0 0 6px' }}>Revisá tu mail</h1>
              <p style={{ color: '#505466', lineHeight: 1.6 }}>
                Si pagaste tu kit, en unos minutos te llega un mail con los archivos (mirá también en spam). Si pasa más de una hora, escribinos con el email de la compra.
              </p>
              <a className="btn btn-primary" href={waHref('kit_gracias', 'Hola NEXA! Pagué mi kit y no me llegó el mail. Compré con este email: ')} style={{ marginTop: 12 }}>Escribir por WhatsApp</a>
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/soluciones-ia" style={{ color: '#6B3FD4' }}>Volver a Kits IA</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
