import { CartProvider } from '@/components/aprende/CartContext';
import CartButton from '@/components/aprende/CartButton';

/*
 * Esta directiva vivía en el layout raíz y por eso dejaba TODO el sitio sin
 * caché. Acá es donde realmente hace falta: el catálogo, el carrito, el
 * checkout, la cuenta y el panel de administración leen la base y la sesión en
 * cada request, así que no se pueden prerenderizar.
 *
 * Al estar en el layout de /aprende, cubre todas las rutas de la tienda.
 */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NEXA Aprende | Biblioteca premium de recursos digitales',
  description: 'Guías, packs y plantillas descargables sobre IA, Instagram, WhatsApp Business, marketing, ventas, desarrollo web, SEO, Excel/Power BI, finanzas y productividad.',
  alternates: {
    canonical: '/aprende',
  },
  openGraph: {
    title: 'NEXA Aprende | Biblioteca premium de recursos digitales',
    description: 'Más de 100 guías descargables para crecer tu negocio, organizadas en 10 categorías.',
    url: '/aprende',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function AprendeLayout({ children }) {
  return (
    <CartProvider>
      {children}
      <CartButton />
    </CartProvider>
  );
}
