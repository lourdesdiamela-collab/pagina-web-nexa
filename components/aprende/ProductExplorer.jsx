'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';
import { CategoryPillsFilter } from './CategoryPills';
import { filterProducts } from '@/lib/catalogFilter';

const SORTS = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'vendidos', label: 'Más vendidos' },
  { value: 'nuevos', label: 'Más nuevos' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
];

export default function ProductExplorer({
  products,
  categories,
  initialCategory = 'Todos',
  lockCategory = false,
  showPills = true,
  query: controlledQuery,
  onQueryChange,
  id,
}) {
  const [internalQuery, setInternalQuery] = useState('');
  const query = controlledQuery !== undefined ? controlledQuery : internalQuery;
  const setQuery = onQueryChange || setInternalQuery;
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('relevancia');

  const results = useMemo(() => {
    const base = filterProducts(products, query, category);
    const sorted = [...base];
    if (sort === 'vendidos') sorted.sort((a, b) => b.rating * b.reviewsCount - a.rating * a.reviewsCount);
    if (sort === 'nuevos') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === 'precio-asc') sorted.sort((a, b) => a.price - b.price || a.title.localeCompare(b.title));
    if (sort === 'precio-desc') sorted.sort((a, b) => b.price - a.price || a.title.localeCompare(b.title));
    return sorted;
  }, [products, query, category, sort]);

  return (
    <div className="aprende-explorer" id={id}>
      <div className="aprende-explorer-controls">
        <label className="aprende-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por tema, herramienta o palabra clave"
          />
        </label>
        <label className="aprende-sort">
          <SlidersHorizontal size={15} />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      {showPills && !lockCategory && (
        <CategoryPillsFilter active={category} onSelect={setCategory} categories={categories} />
      )}

      {results.length > 0 ? (
        <div className="aprende-grid">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="aprende-empty">
          No encontramos recursos para «{query}». Probá con otra palabra clave o categoría.
        </div>
      )}
    </div>
  );
}
