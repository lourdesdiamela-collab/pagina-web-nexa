import { NextResponse } from 'next/server';
import { listProductsForCart } from '@/lib/catalogQueries';

/*
 * Catálogo liviano usado por el carrito (localStorage) para resolver precios
 * y datos de producto reales desde la base de datos en cada carga.
 *
 * force-dynamic: esta ruta consulta la base, así que NO tiene que ejecutarse
 * durante `next build`. Antes se prerenderizaba, y eso hacía que el build
 * entero fallara si la base no estaba disponible en ese momento (por ejemplo,
 * en una copia recién clonada sin migraciones corridas, o en un hosting que
 * compila sin acceso a la base). El catálogo se sirve en cada pedido.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await listProductsForCart();
    return NextResponse.json(data);
  } catch (error) {
    // Si la base no responde, el carrito recibe un catálogo vacío y muestra su
    // estado "no pudimos cargar", en lugar de romper la página entera.
    console.error('GET /api/aprende/products — no se pudo leer el catálogo:', error);
    return NextResponse.json(
      { products: [], categoryProductCounts: {}, error: 'catalogo_no_disponible' },
      { status: 503 },
    );
  }
}
