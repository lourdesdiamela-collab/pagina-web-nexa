import { prisma } from '@/lib/db';
import ProductForm from '../ProductForm';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return (
    <>
      <h1>Nuevo producto</h1>
      <p className="admin-subtitle">Se crea directo en la base de datos y aparece al instante en la tienda.</p>
      <div className="aprende-admin-card">
        <ProductForm categories={categories} />
      </div>
    </>
  );
}
