import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductExplorer from '@/components/aprende/ProductExplorer';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { getCategories, getCategoryBySlug, getProductsByCategory } from '@/lib/catalogQueries';

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.cat);
  if (!category) return { title: 'Categoría no encontrada | NEXA Aprende' };
  return {
    title: `${category.label} | NEXA Aprende`,
    description: `Guías y recursos descargables de ${category.fullLabel} en NEXA Aprende.`,
    alternates: { canonical: `/aprende/categoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const category = await getCategoryBySlug(params.cat);
  if (!category) notFound();

  const Icon = getCategoryIcon(category.slug);
  const [products, categories] = await Promise.all([
    getProductsByCategory(category.slug),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80 }}>
          <Link href="/aprende" className="aprende-back-link">
            <ArrowLeft size={14} /> Volver a Aprende
          </Link>

          <header className="aprende-category-header" style={{ '--cat-color': category.color }}>
            <span className="aprende-category-icon"><Icon size={26} strokeWidth={1.7} /></span>
            <div>
              <h1>{category.fullLabel}</h1>
              <p>{products.length} recursos disponibles en esta categoría.</p>
            </div>
          </header>

          <ProductExplorer products={products} categories={categories} initialCategory={category.slug} lockCategory showPills={false} />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
