import { prisma } from '@/lib/db';
import { saveCategory, deleteCategory } from '@/lib/adminActions';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <h1>Categorías</h1>
      <p className="admin-subtitle">{categories.length} categorías. El slug define la URL (/aprende/categoria/slug).</p>

      <div className="aprende-admin-card">
        <h2>Categorías actuales</h2>
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead><tr><th>Orden</th><th>Label</th><th>Nombre completo</th><th>Slug</th><th>Color</th><th>Productos</th><th></th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <form action={saveCategory} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 1fr 1fr 60px 90px', gap: 8, alignItems: 'center', padding: '10px 12px' }}>
                      <input type="hidden" name="id" value={c.id} />
                      <input name="sortOrder" type="number" defaultValue={c.sortOrder} style={{ width: 56 }} />
                      <input name="label" defaultValue={c.label} required />
                      <input name="fullLabel" defaultValue={c.fullLabel} />
                      <input name="slug" defaultValue={c.slug} />
                      <input name="color" type="color" defaultValue={c.color} style={{ height: 34, padding: 2 }} />
                      <button type="submit" className="aprende-btn-mini">Guardar</button>
                    </form>
                  </td>
                  <td>{c._count.products}</td>
                  <td>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="aprende-btn-mini danger" disabled={c._count.products > 0}>
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="aprende-admin-card">
        <h2>Nueva categoría</h2>
        <form action={saveCategory} className="aprende-form" style={{ maxWidth: 560 }}>
          <div className="aprende-field">
            <label htmlFor="label">Nombre corto (label)</label>
            <input id="label" name="label" required placeholder="Ej: Copywriting" />
          </div>
          <div className="aprende-field">
            <label htmlFor="fullLabel">Nombre completo</label>
            <input id="fullLabel" name="fullLabel" placeholder="Ej: Copywriting y Redacción" />
          </div>
          <div className="aprende-field">
            <label htmlFor="slug">Slug (opcional, se genera del nombre si se deja vacío)</label>
            <input id="slug" name="slug" placeholder="copywriting" />
          </div>
          <div className="aprende-field">
            <label htmlFor="color">Color</label>
            <input id="color" name="color" type="color" defaultValue="#835CE6" style={{ height: 44, padding: 4 }} />
          </div>
          <button type="submit" className="btn btn-primary">Crear categoría</button>
        </form>
      </div>
    </>
  );
}
