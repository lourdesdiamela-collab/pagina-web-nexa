import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NEXA | Ecosistemas de Crecimiento & CRM Inteligente',
  description: 'Transformamos marketing, seguimiento comercial, automatización y datos en crecimiento medible para tu empresa.',
  metadataBase: new URL('https://nexagrowth.com.ar'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'NEXA | Ecosistemas de Crecimiento & CRM Inteligente',
    description: 'Transformamos marketing, seguimiento comercial, automatización y datos en crecimiento medible para tu empresa.',
    url: 'https://nexagrowth.com.ar',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/nexa-hero-new.png',
        width: 1200,
        height: 630,
        alt: 'NEXA Growth Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXA | Ecosistemas de Crecimiento & CRM Inteligente',
    description: 'Transformamos marketing, seguimiento comercial, automatización y datos en crecimiento medible para tu empresa.',
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
              "description": "Empresa tecnológica orientada a crecimiento empresarial mediante automatización, CRM e IA.",
              "sameAs": [
                "https://www.linkedin.com/company/nexagrowth",
                "https://www.instagram.com/nexagrowth"
              ]
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
