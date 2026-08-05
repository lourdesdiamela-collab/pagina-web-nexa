import Link from 'next/link';
import { Plus, Pencil, FileCheck2, FileX2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/products.mjs';
import { deleteProduct } from '@/lib/adminActions';

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="aprende-admin-topbar">
        <div>
          <h1>Productos</h1>
          <p className="admin-subtitle" style={{ marginBottom: 0 }}>{products.length} productos en el catálogo.</p>
        </div>
        <Link href="/aprende/admin/productos/nuevo" className="btn btn-primary btn-sm">
          <Plus size={15} /> Nuevo producto
        </Link>
      </div>

      <div className="aprende-admin-card">
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead>
              <tr>
                <th>Título</th><th>Categoría</th><th>Precio</th><th>PDF</th><th>Flags</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.category.label}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    {p.fileUrl
                      ? <span style={{ color: '#5c6a12', display: 'inline-flex', alignItems: 'center', gap: 4 }}><FileCheck2 size={14} /> Cargado</span>
                      : <span style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><FileX2 size={14} /> Falta</span>}
                  </td>
                  <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {[p.featured && 'Destacado', p.bestSeller && 'Más vendido', p.isNew && 'Nuevo', p.onSale && 'Oferta'].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <Link href={`/aprende/admin/productos/${p.id}`} className="aprende-btn-mini"><Pencil size={13} /> Editar</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="aprende-btn-mini danger">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
