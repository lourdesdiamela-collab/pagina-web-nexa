import { BASE_PRICE } from './products.mjs';

/* ══════════════════════════════════════
   NEXA Aprende — Motor de promociones del carrito
   Reglas (definidas por el negocio):
   - 3 productos del mismo pedido: $19.999 el grupo de 3
   - 5 productos del mismo pedido: $39.999 el grupo de 5
   - Pack de categoría completa (10/10 productos distintos): 30% OFF esa categoría
   - Biblioteca completa (100/100 productos distintos): precio especial fijo
   Todo se aplica automáticamente y de forma determinística — es una simulación
   client-side, no hay motor de precios en un backend real (ver APRENDE_README.md).
   ══════════════════════════════════════ */

export const BUNDLE_3_PRICE = 19999;
export const BUNDLE_5_PRICE = 39999;
export const CATEGORY_DISCOUNT = 0.3;
export const LIBRARY_PRICE = 349999;

// Descuento adicional por pagar con transferencia bancaria (checkout de Aprende).
// Se aplica sobre el total ya calculado por el motor de promos (y el cupón, si hay).
export const TRANSFER_DISCOUNT = 0.1;

export function applyTransferDiscount(total) {
  return Math.max(0, Math.round(total * (1 - TRANSFER_DISCOUNT)));
}

/* Mínimo costo para cubrir n unidades sueltas usando 1 / 3 / 5 como "denominaciones" (DP). */
function minCostForUnits(n) {
  if (n <= 0) return 0;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i += 1) {
    dp[i] = dp[i - 1] + BASE_PRICE;
    if (i >= 3) dp[i] = Math.min(dp[i], dp[i - 3] + BUNDLE_3_PRICE);
    if (i >= 5) dp[i] = Math.min(dp[i], dp[i - 5] + BUNDLE_5_PRICE);
  }
  return dp[n];
}

/*
 * catalog: { productsBySlug: Map<slug, {slug, price, category}>,
 *            categoryProductCounts: Map<categorySlug, number>,
 *            totalProductsCount: number }
 * Antes esta función importaba el catálogo estático directamente; ahora lo
 * recibe resuelto (desde la base de datos) para que precios/categorías
 * reflejen lo que haya en el admin en cada momento.
 */
export function computeCartTotals(items, catalog) {
  const productsBySlug = catalog?.productsBySlug || new Map();
  const categoryProductCounts = catalog?.categoryProductCounts || new Map();
  const totalProductsCount = catalog?.totalProductsCount ?? 0;

  const resolved = items
    .map((item) => ({ item, product: productsBySlug.get(item.slug) }))
    .filter((r) => r.product);

  const originalTotal = resolved.reduce((sum, r) => sum + r.product.price * r.item.qty, 0);
  const totalUnits = resolved.reduce((sum, r) => sum + r.item.qty, 0);

  if (resolved.length === 0) {
    return {
      originalTotal: 0,
      total: 0,
      savings: 0,
      totalUnits: 0,
      breakdown: [],
    };
  }

  const distinctSlugs = new Set(resolved.map((r) => r.product.slug));
  const breakdown = [];
  let total = 0;
  let poolCount = 0;

  const isFullLibrary = totalProductsCount > 0 && distinctSlugs.size === totalProductsCount;

  if (isFullLibrary) {
    total += LIBRARY_PRICE;
    breakdown.push({
      type: 'library',
      label: 'Biblioteca completa NEXA Aprende (100/100)',
      amount: LIBRARY_PRICE,
    });
    resolved.forEach((r) => {
      const extra = r.item.qty - 1;
      if (extra > 0) poolCount += extra;
    });
  } else {
    const consumedSlugs = new Set();
    const categorySlugsInCart = new Set(resolved.map((r) => r.product.category));

    categorySlugsInCart.forEach((categorySlug) => {
      const inCategory = resolved.filter((r) => r.product.category === categorySlug);
      const distinctInCategory = new Set(inCategory.map((r) => r.product.slug));
      const categoryTotalProducts = categoryProductCounts.get(categorySlug) || 0;
      if (categoryTotalProducts > 0 && distinctInCategory.size >= categoryTotalProducts) {
        const bundleAmount = Math.round(BASE_PRICE * categoryTotalProducts * (1 - CATEGORY_DISCOUNT));
        total += bundleAmount;
        breakdown.push({
          type: 'category',
          label: `Pack ${inCategory[0].product.categoryLabel} completo (${categoryTotalProducts}/${categoryTotalProducts}) · 30% OFF`,
          amount: bundleAmount,
        });
        inCategory.forEach((r) => {
          consumedSlugs.add(r.product.slug);
          const extra = r.item.qty - 1;
          if (extra > 0) poolCount += extra;
        });
      }
    });

    resolved.forEach((r) => {
      if (consumedSlugs.has(r.product.slug)) return;
      poolCount += r.item.qty;
    });
  }

  if (poolCount > 0) {
    const bundleCost = minCostForUnits(poolCount);
    total += bundleCost;
    if (poolCount >= 3) {
      breakdown.push({
        type: 'bundle',
        label: `${poolCount} recursos con promo automática por cantidad`,
        amount: bundleCost,
      });
    } else {
      breakdown.push({
        type: 'regular',
        label: `${poolCount} recurso${poolCount > 1 ? 's' : ''} a precio regular`,
        amount: bundleCost,
      });
    }
  }

  const savings = Math.max(0, originalTotal - total);

  return {
    originalTotal,
    total,
    savings,
    totalUnits,
    breakdown,
  };
}

export function nextPromoHint(totalUnits) {
  if (totalUnits === 0) return 'Agregá 3 recursos y desbloqueás precio promo automático.';
  if (totalUnits < 3) return `Agregá ${3 - totalUnits} recurso${3 - totalUnits > 1 ? 's' : ''} más y pagás $19.999 por los 3.`;
  if (totalUnits < 5) return `Agregá ${5 - totalUnits} recurso${5 - totalUnits > 1 ? 's' : ''} más y pagás $39.999 por los 5.`;
  return 'Completá una categoría entera (10/10) y sumás 30% OFF automático.';
}
