import Link from 'next/link';
import AprendeHomeClient from '@/components/aprende/AprendeHomeClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  listProducts, getCategories, getFeaturedProducts, getBestSellers, getNewArrivals, getDeals,
} from '@/lib/catalogQueries';

export const metadata = {
  title: 'NEXA Aprende | Guías y Recursos Descargables de Marketing',
  description: 'Guías, plantillas y recursos descargables sobre marketing digital, redes sociales, publicidad y ventas para aplicar en tu negocio.',
  alternates: { canonical: '/aprende' },
  openGraph: {
    title: 'NEXA Aprende | Guías y Recursos Descargables de Marketing',
    description: 'Guías, plantillas y recursos descargables sobre marketing digital, redes sociales, publicidad y ventas para aplicar en tu negocio.',
    url: 'https://nexagrowth.com.ar/aprende',
  },
};

/*
 * Si la base de datos no está disponible (por ejemplo, migraciones sin correr),
 * esta página mostraba un error 500 crudo. Ahora muestra un aviso claro y el
 * resto del sitio sigue navegable.
 */
export default async function AprendeHomePage() {
  let datos = null;

  try {
    const [allProducts, categories, featured, bestSellers, newArrivals, deals] = await Promise.all([
      listProducts(),
      getCategories(),
      getFeaturedProducts(8),
      getBestSellers(8),
      getNewArrivals(8),
      getDeals(8),
    ]);
    datos = { allProducts, categories, featured, bestSellers, newArrivals, deals };
  } catch (error) {
    console.error('No se pudo cargar el catálogo de Aprende:', error);
  }

  if (!datos) {
    return (
      <>
        <Navbar />
        <main style={{ paddingTop: 'clamp(100px, 12vw, 140px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
          <div className="container" style={{ paddingBottom: 90, maxWidth: 620, textAlign: 'center' }}>
            <h1 className="section-title">La biblioteca no está disponible</h1>
            <p className="section-subtitle" style={{ margin: '0 auto 24px' }}>
              No pudimos cargar el catálogo en este momento. Volvé a intentar en un rato.
            </p>
            <Link href="/" className="btn btn-primary">Ir al inicio</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const categoryCounts = {};
  datos.allProducts.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <AprendeHomeClient
      allProducts={datos.allProducts}
      categories={datos.categories}
      categoryCounts={categoryCounts}
      featured={datos.featured}
      bestSellers={datos.bestSellers}
      newArrivals={datos.newArrivals}
      deals={datos.deals}
      totalProducts={datos.allProducts.length}
    />
  );
}
