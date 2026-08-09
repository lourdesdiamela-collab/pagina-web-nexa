import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog NEXA | Recursos de marketing, ventas y datos',
  description: 'Artículos y guías sobre marketing digital, redes sociales, campañas, CRM y ventas para hacer crecer tu negocio.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog NEXA | Recursos de marketing, ventas y datos',
    description: 'Artículos y guías sobre marketing digital, redes sociales, campañas, CRM y ventas para hacer crecer tu negocio.',
    url: '/blog',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
