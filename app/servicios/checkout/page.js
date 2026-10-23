import ServicioCheckoutClient from './ServicioCheckoutClient';
import { verificarRenovacion } from '@/lib/renovacion';

/*
 * Checkout de servicios. La página en sí es el componente de cliente
 * ServicioCheckoutClient.jsx; este archivo de servidor solo verifica el link
 * de renovación firmado (ver lib/renovacion.js), porque la firma usa un
 * secreto que nunca puede llegar al navegador.
 *
 * Si el link de renovación no es válido para el plan pedido, la página
 * muestra el precio de una contratación normal (con la Puesta en marcha),
 * que es lo mismo que va a cobrar la API.
 */
export const dynamic = 'force-dynamic';

export default function ServicioCheckoutPage({ searchParams }) {
  const planId = String(searchParams?.plan || '');
  const renovacion = verificarRenovacion(searchParams, planId);
  return <ServicioCheckoutClient renovacion={renovacion} />;
}
