import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getFile } from '@/lib/storage';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Necesitás iniciar sesión.' }, { status: 401 });
  }

  const { productId } = params;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: 'Recurso no encontrado.' }, { status: 404 });
  }
  if (!product.fileUrl) {
    return NextResponse.json({ error: 'Este recurso todavía no tiene archivo cargado.' }, { status: 404 });
  }

  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: session.user.id, status: 'APPROVED' },
    },
  });
  if (!purchase) {
    return NextResponse.json({ error: 'No compraste este recurso.' }, { status: 403 });
  }

  try {
    const buffer = await getFile(product.fileUrl);
    const filename = `${product.slug}.pdf`;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('GET /api/download error:', error);
    return NextResponse.json({ error: 'No pudimos leer el archivo.' }, { status: 500 });
  }
}
