import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, FileText, BarChart2, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import ProductCover from '@/components/aprende/ProductCover';
import ProductCard from '@/components/aprende/ProductCard';
import ProductActions from '@/components/aprende/ProductActions';
import UrgencyCountdown from '@/components/aprende/UrgencyCountdown';
import StarRating from '@/components/aprende/StarRating';
import ReviewList from '@/components/aprende/ReviewList';
import { formatPrice } from '@/lib/products.mjs';
import { getProductBySlug, getRelatedProducts } from '@/lib/catalogQueries';

export async function generateMetadata({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Recurso no encontrado | NEXA Aprende' };

  return {
    title: `${product.title} | NEXA Aprende`,
    description: product.subtitle,
    alternates: { canonical: `/aprende/producto/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.subtitle,
      url: `/aprende/producto/${product.slug}`,
      siteName: 'NEXA',
      type: 'website',
      locale: 'es_AR',
    },
    other: {
      'product:price:amount': String(product.price),
      'product:price:currency': 'ARS',
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.subtitle,
    category: product.categoryLabel,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div className="container" style={{ paddingBottom: 80 }}>
          <Link href={`/aprende/categoria/${product.category}`} className="aprende-back-link">
            <ArrowLeft size={14} /> Volver a {product.categoryLabel}
          </Link>

          <div className="aprende-product-layout">
            <div className="aprende-product-media">
              <ProductCover product={product} size="lg" />
            </div>

            <div className="aprende-product-info">
              <span className="aprende-card-category" style={{ color: product.categoryColor }}>{product.categoryLabel}</span>
              <h1 className="aprende-product-title">{product.title}</h1>
              <p className="aprende-product-subtitle">{product.subtitle}</p>

              <div className="aprende-product-meta-row">
                <span><BarChart2 size={14} /> {product.level}</span>
                <span><FileText size={14} /> {product.pages} páginas</span>
                <span><Clock size={14} /> {product.readTime}</span>
              </div>

              <StarRating rating={product.rating} count={product.reviewsCount} size={15} />

              <div className="aprende-product-price-row">
                {product.compareAtPrice && <span className="aprende-card-price-old" style={{ fontSize: '1.1rem' }}>{formatPrice(product.compareAtPrice)}</span>}
                <span className="aprende-product-price">{formatPrice(product.price)}</span>
                <span className="aprende-product-price-note">ARS · pago único</span>
              </div>

              <ProductActions product={product} />

              <div style={{ marginTop: 14 }}>
                <UrgencyCountdown compact />
              </div>

              <p className="aprende-product-description">{product.description}</p>

              <div className="aprende-includes-box">
                <span className="svc-block-title">Qué incluye</span>
                <ul className="svc-includes">
                  {product.includes.map((item) => (
                    <li key={item}><CheckCircle2 size={16} color="#835CE6" /> {item}</li>
                  ))}
                </ul>
              </div>

              <div className="aprende-preview-box">
                <span className="svc-block-title">Vista previa</span>
                <p>{product.preview}</p>
              </div>
            </div>
          </div>

          <div className="aprende-reviews-section">
            <div className="section-header" style={{ textAlign: 'left', marginBottom: 24 }}>
              <span className="section-tag">Reseñas</span>
              <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>
                Lo que dicen quienes ya lo compraron
              </h2>
            </div>
            <ReviewList reviews={product.reviews} />
          </div>

          {related.length > 0 && (
            <div className="aprende-related-section">
              <div className="section-header" style={{ textAlign: 'left', marginBottom: 24 }}>
                <span className="section-tag">También te puede servir</span>
                <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: 0 }}>Productos relacionados</h2>
              </div>
              <div className="aprende-grid">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
