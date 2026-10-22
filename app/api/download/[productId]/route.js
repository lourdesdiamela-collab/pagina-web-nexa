import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getFile } from '@/lib/storage';
import { limitar, DIA } from '@/lib/rateLimit';

// Descargas por usuario y por producto en 24 horas. Alcanza de sobra para un
// comprador real y frena que una cuenta compartida se use para repartir el
// material.
const MAX_DESCARGAS_POR_DIA = 10;

// Encabezados de las respuestas de esta ruta: que nada quede guardado en
// cachés intermedios ni indexado, y que el archivo no se pueda incrustar
// desde otro sitio.
const HEADERS_PRIVADOS = {
  'Cache-Control': 'private, no-store, max-age=0',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cross-Origin-Resource-Policy': 'same-origin',
  // X-Content-Type-Options: nosniff ya lo pone next.config.mjs en todo el sitio.
};

function error(mensaje, status) {
  return NextResponse.json({ error: mensaje }, { status, headers: HEADERS_PRIVADOS });
}

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return error('Necesitás iniciar sesión.', 401);
  }

  const productId = String(params?.productId || '');

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return error('Recurso no encontrado.', 404);
  }
  if (!product.fileUrl) {
    return error('Este recurso todavía no tiene archivo cargado.', 404);
  }

  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: session.user.id, status: 'APPROVED' },
    },
  });
  if (!purchase) {
    return error('No compraste este recurso.', 403);
  }

  if (!(await limitar('descarga', `${session.user.id}:${productId}`, { maximo: MAX_DESCARGAS_POR_DIA, ventanaMs: DIA }))) {
    return error('Llegaste al límite de descargas de este recurso por hoy. Probá de nuevo mañana o escribinos si necesitás ayuda.', 429);
  }

  try {
    const buffer = await getFile(product.fileUrl);
    const filename = `${product.slug}.pdf`;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        ...HEADERS_PRIVADOS,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('GET /api/download error:', err);
    return error('No pudimos leer el archivo.', 500);
  }
}
