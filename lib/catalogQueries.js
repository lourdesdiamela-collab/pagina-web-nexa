import { prisma } from '@/lib/db';
import { coverVariant, buildPreview } from '@/lib/products.mjs';

/*
 * Capa de acceso a datos del catálogo (Fase 2) — reemplaza las lecturas
 * directas a lib/products.mjs en las páginas/componentes de servidor.
 * lib/products.mjs sigue existiendo solo como generador de datos semilla
 * (prisma/seed.mjs) y utilidades puras sin DB (formatPrice, CATEGORIES para
 * iconos, coverVariant).
 *
 * Cada producto se "shapea" al mismo formato que usaban los componentes en
 * Fase 1 (product.category, product.categoryLabel, product.rating, etc.) para
 * no tener que reescribir toda la UI — solo el origen de los datos cambia.
 */

async function getReviewStatsMap() {
  const stats = await prisma.review.groupBy({
    by: ['productId'],
    where: { approved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  const map = new Map();
  stats.forEach((s) => {
    map.set(s.productId, { rating: Math.round((s._avg.rating || 0) * 10) / 10, reviewsCount: s._count.rating });
  });
  return map;
}

function parseIncludes(json) {
  try {
    const arr = JSON.parse(json || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function shapeProduct(p, statsMap, reviews = []) {
  const stats = statsMap?.get(p.id) || { rating: 0, reviewsCount: 0 };
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    preview: buildPreview(p.title, p.subtitle),
    category: p.category.slug,
    categoryLabel: p.category.label,
    categoryColor: p.category.color,
    level: p.level,
    pages: p.pages,
    readTime: p.readTime,
    price: p.price,
    compareAtPrice: p.onSale ? Math.round((p.price * 1.4) / 10) * 10 : null,
    deal: p.onSale,
    rating: stats.rating,
    reviewsCount: stats.reviewsCount,
    reviews: reviews.map((r) => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, date: r.createdAt.toISOString() })),
    createdAt: p.createdAt.toISOString(),
    isNew: p.isNew,
    featured: p.featured,
    bestSeller: p.bestSeller,
    fileUrl: p.fileUrl,
    includes: parseIncludes(p.includes),
    coverSeed: coverVariant(p.slug),
  };
}

export async function getCategories() {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  return rows;
}

export async function getCategoryBySlug(slug) {
  return prisma.category.findUnique({ where: { slug } });
}

// Versión liviana (sin reseñas/rating) para el carrito y el motor de precios —
// evita cargar 100 productos con reseñas solo para calcular totales.
export async function listProductsForCart() {
  const products = await prisma.product.findMany({
    select: {
      id: true, slug: true, title: true, price: true, pages: true, categoryId: true,
      category: { select: { slug: true, label: true, color: true } },
    },
  });
  const categoryProductCounts = new Map();
  products.forEach((p) => {
    categoryProductCounts.set(p.category.slug, (categoryProductCounts.get(p.category.slug) || 0) + 1);
  });
  const shaped = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    pages: p.pages,
    category: p.category.slug,
    categoryLabel: p.category.label,
    categoryColor: p.category.color,
    coverSeed: coverVariant(p.slug),
  }));
  return { products: shaped, categoryProductCounts: Object.fromEntries(categoryProductCounts) };
}

export async function listProducts() {
  const [products, statsMap] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'asc' } }),
    getReviewStatsMap(),
  ]);
  return products.map((p) => shapeProduct(p, statsMap));
}

export async function getProductBySlug(slug) {
  const p = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!p) return null;
  const [statsMap, reviews] = await Promise.all([
    getReviewStatsMap(),
    prisma.review.findMany({ where: { productId: p.id, approved: true }, orderBy: { createdAt: 'desc' } }),
  ]);
  return shapeProduct(p, statsMap, reviews);
}

export async function getProductsByCategory(categorySlug) {
  const [products, statsMap] = await Promise.all([
    prisma.product.findMany({ where: { category: { slug: categorySlug } }, include: { category: true }, orderBy: { createdAt: 'asc' } }),
    getReviewStatsMap(),
  ]);
  return products.map((p) => shapeProduct(p, statsMap));
}

export async function getFeaturedProducts(limit = 8) {
  const [products, statsMap] = await Promise.all([
    prisma.product.findMany({ where: { featured: true }, include: { category: true }, take: limit }),
    getReviewStatsMap(),
  ]);
  return products.map((p) => shapeProduct(p, statsMap));
}

export async function getBestSellers(limit = 8) {
  const [products, statsMap] = await Promise.all([
    prisma.product.findMany({ where: { bestSeller: true }, include: { category: true }, take: limit }),
    getReviewStatsMap(),
  ]);
  return products.map((p) => shapeProduct(p, statsMap));
}

export async function getNewArrivals(limit = 8) {
  const [products, statsMap] = await Promise.all([
    prisma.product.findMany({ where: { isNew: true }, include: { category: true }, orderBy: { createdAt: 'desc' }, take: limit }),
    getReviewStatsMap(),
  ]);
  return products.map((p) => shapeProduct(p, statsMap));
}

export async function getDeals(limit = 12) {
  const [products, statsMap] = await Promise.all([
    prisma.product.findMany({ where: { onSale: true }, include: { category: true }, take: limit }),
    getReviewStatsMap(),
  ]);
  return products.map((p) => shapeProduct(p, statsMap));
}

export async function getRelatedProducts(product, limit = 4) {
  const [sameCategory, statsMap] = await Promise.all([
    prisma.product.findMany({
      where: { category: { slug: product.category }, slug: { not: product.slug } },
      include: { category: true },
      take: limit,
    }),
    getReviewStatsMap(),
  ]);
  if (sameCategory.length >= limit) return sameCategory.map((p) => shapeProduct(p, statsMap));

  const fill = await prisma.product.findMany({
    where: { slug: { not: product.slug }, category: { slug: { not: product.category } } },
    include: { category: true },
    take: limit - sameCategory.length,
  });
  return [...sameCategory, ...fill].map((p) => shapeProduct(p, statsMap));
}
