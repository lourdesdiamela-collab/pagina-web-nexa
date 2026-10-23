import { requireAdminPage } from '@/lib/adminAuth';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductForm from '../ProductForm';

export default async function EditProductPage({ params }) {
  // Chequeo propio de la página: el del layout no alcanza (ver lib/adminAuth.js).
  await requireAdminPage();
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <h1>Editar producto</h1>
      <p className="admin-subtitle">{product.title}</p>
      <div className="aprende-admin-card">
        <ProductForm product={product} categories={categories} />
      </div>
    </>
  );
}
