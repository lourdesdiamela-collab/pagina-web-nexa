import { listArticles } from '@/lib/articles';
import { listProducts, CATEGORIES } from '@/lib/products.mjs';

const SITE_URL = 'https://nexagrowth.com.ar';

// Paginas de negocio, indexables. Las transaccionales (checkout, carrito,
// login, registro, admin) quedan afuera a proposito: ya estan en noindex.
const STATIC_ROUTES = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/servicios', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/casos', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/aprende', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/contacto', changeFrequency: 'monthly', priority: 0.6 },
];

export default function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const articleEntries = listArticles().map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const categoryEntries = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/aprende/categoria/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  const productEntries = listProducts().map((product) => ({
    url: `${SITE_URL}/aprende/producto/${product.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticEntries, ...articleEntries, ...categoryEntries, ...productEntries];
}
