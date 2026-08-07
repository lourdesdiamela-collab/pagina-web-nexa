import { Plus_Jakarta_Sans } from 'next/font/google';
import AuthProvider from '@/components/aprende/AuthProvider';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NEXA | Marketing Digital, Redes Sociales y Publicidad con IA',
  description: 'Agencia de marketing digital: gestión de redes sociales, campañas de publicidad y automatización con IA para conseguir más clientes y vender más.',
  metadataBase: new URL('https://nexagrowth.com.ar'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'NEXA | Marketing Digital, Redes Sociales y Publicidad con IA',
    description: 'Agencia de marketing digital: gestión de redes sociales, campañas de publicidad y automatización con IA para conseguir más clientes y vender más.',
    url: 'https://nexagrowth.com.ar',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/nexa-hero-new.png',
        width: 1200,
        height: 630,
        alt: 'NEXA Marketing Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXA | Marketing Digital, Redes Sociales y Publicidad con IA',
    description: 'Agencia de marketing digital: gestión de redes sociales, campañas de publicidad y automatización con IA para conseguir más clientes y vender más.',
    images: ['/nexa-hero-new.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "NEXA",
              "url": "https://nexagrowth.com.ar",
              "logo": "https://nexagrowth.com.ar/favicon.svg",
              "description": "Agencia de marketing digital especializada en redes sociales, publicidad y automatización con IA aplicada al crecimiento de marcas.",
              "sameAs": [
                "https://www.linkedin.com/company/nexagrowth",
                "https://www.instagram.com/nexagrowth.ar"
              ]
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
