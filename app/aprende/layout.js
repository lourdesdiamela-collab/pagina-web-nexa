import { CartProvider } from '@/components/aprende/CartContext';
import CartButton from '@/components/aprende/CartButton';

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
