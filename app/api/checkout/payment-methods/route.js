import { NextResponse } from 'next/server';
import { isMpConfigured, isSimulationAllowed } from '@/lib/mercadopago';

/*
 * Le dice al checkout (cliente) qué medios de pago están realmente
 * disponibles, para no ofrecer un botón de "Pagar con Mercado Pago" que va a
 * fallar, ni renderizar el simulador de pago fuera de desarrollo.
 *
 * Devuelve solo booleanos: ninguna credencial sale de acá.
 */
export async function GET() {
  return NextResponse.json(
    {
      mercadopago: isMpConfigured(),
      transfer: true,
      simulation: isSimulationAllowed(),
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
