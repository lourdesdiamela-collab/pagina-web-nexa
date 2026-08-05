import Link from 'next/link';
import { saveProduct } from '@/lib/adminActions';

export default function ProductForm({ product, categories }) {
  const includesText = product ? JSON.parse(product.includes || '[]').join('\n') : '';

  return (
    <form action={saveProduct} className="aprende-form" style={{ maxWidth: 640 }}>
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="form-row-2">
        <div className="aprende-field">
          <label htmlFor="title">Título</label>
          <input id="title" name="title" defaultValue={product?.title} required />
        </div>
        <div className="aprende-field">
          <label htmlFor="slug">Slug (URL)</label>
          <input id="slug" name="slug" defaultValue={product?.slug} placeholder="se genera del título si se deja vacío" />
        </div>
      </div>

      <div className="aprende-field">
        <label htmlFor="subtitle">Subtítulo</label>
        <input id="subtitle" name="subtitle" defaultValue={product?.subtitle} required />
      </div>

      <div className="aprende-field">
        <label htmlFor="description">Descripción</label>
        <textarea id="description" name="description" defaultValue={product?.description} required />
      </div>

      <div className="form-row-3">
        <div className="aprende-field">
          <label htmlFor="price">Precio (ARS)</label>
          <input id="price" name="price" type="number" min="0" defaultValue={product?.price ?? 9999} required />
        </div>
        <div className="aprende-field">
          <label htmlFor="categoryId">Categoría</label>
          <select id="categoryId" name="categoryId" defaultValue={product?.categoryId} required>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="aprende-field">
          <label htmlFor="level">Nivel</label>
          <select id="level" name="level" defaultValue={product?.level || 'Principiante'}>
            <option>Principiante</option>
            <option>Intermedio</option>
            <option>Avanzado</option>
          </select>
        </div>
      </div>

      <div className="form-row-3">
        <div className="aprende-field">
          <label htmlFor="pages">Páginas</label>
          <input id="pages" name="pages" type="number" min="1" defaultValue={product?.pages ?? 100} />
        </div>
        <div className="aprende-field">
          <label htmlFor="readTime">Tiempo de lectura</label>
          <input id="readTime" name="readTime" defaultValue={product?.readTime || '90 min'} />
        </div>
        <div className="aprende-field">
          <label htmlFor="pdf">Archivo PDF {product?.fileUrl && '(ya hay uno cargado — subí otro para reemplazarlo)'}</label>
          <input id="pdf" name="pdf" type="file" accept="application/pdf" />
        </div>
      </div>

      <div className="aprende-field">
        <label htmlFor="includes">Qué incluye (una línea por ítem)</label>
        <textarea id="includes" name="includes" defaultValue={includesText} rows={6} />
      </div>

      <div className="form-row-4">
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <input type="checkbox" name="featured" defaultChecked={product?.featured} /> Destacado
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <input type="checkbox" name="bestSeller" defaultChecked={product?.bestSeller} /> Más vendido
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <input type="checkbox" name="isNew" defaultChecked={product?.isNew} /> Nuevo
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
          <input type="checkbox" name="onSale" defaultChecked={product?.onSale} /> En oferta
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <button type="submit" className="btn btn-primary">Guardar producto</button>
        <Link href="/aprende/admin/productos" className="btn btn-outline">Cancelar</Link>
      </div>

      <style>{`
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .form-row-4 { display: grid; grid-template-columns: repeat(4, auto); gap: 16px; align-items: center; }
        @media (max-width: 700px) { .form-row-2, .form-row-3, .form-row-4 { grid-template-columns: 1fr; } }
      `}</style>
    </form>
  );
}
