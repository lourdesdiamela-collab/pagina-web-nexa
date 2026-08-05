'use client';

// Filtro puro (sin DB) para búsqueda/orden client-side sobre un array de
// productos ya cargado desde el servidor. Reemplaza la búsqueda in-memory
// que antes vivía en lib/products.mjs (searchProducts) para que el explorer
// pueda operar sobre productos reales de la base de datos.
export function filterProducts(products, query, categorySlug = 'Todos') {
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    if (categorySlug !== 'Todos' && p.category !== categorySlug) return false;
    if (!q) return true;
    const haystack = `${p.title} ${p.subtitle} ${p.categoryLabel} ${p.level}`.toLowerCase();
    return haystack.includes(q);
  });
}
