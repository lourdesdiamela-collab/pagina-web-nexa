import { NextResponse } from 'next/server';
import { listProductsForCart } from '@/lib/catalogQueries';

// Catálogo liviano usado por el carrito (localStorage) para resolver precios
// y datos de producto reales desde la base de datos en cada carga.
export async function GET() {
  const data = await listProductsForCart();
  return NextResponse.json(data);
}
