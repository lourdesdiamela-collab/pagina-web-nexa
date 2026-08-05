import AprendeHomeClient from '@/components/aprende/AprendeHomeClient';
import {
  listProducts, getCategories, getFeaturedProducts, getBestSellers, getNewArrivals, getDeals,
} from '@/lib/catalogQueries';

export default async function AprendeHomePage() {
  const [allProducts, categories, featured, bestSellers, newArrivals, deals] = await Promise.all([
    listProducts(),
    getCategories(),
    getFeaturedProducts(8),
    getBestSellers(8),
    getNewArrivals(8),
    getDeals(8),
  ]);

  const categoryCounts = {};
  allProducts.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <AprendeHomeClient
      allProducts={allProducts}
      categories={categories}
      categoryCounts={categoryCounts}
      featured={featured}
      bestSellers={bestSellers}
      newArrivals={newArrivals}
      deals={deals}
      totalProducts={allProducts.length}
    />
  );
}
