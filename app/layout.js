import localFont from 'next/font/local';
import AuthProvider from '@/components/aprende/AuthProvider';
import './globals.css';

/*
 * Tipografía Plus Jakarta Sans, servida desde el propio repositorio.
 *
 * ANTES se usaba `next/font/google`, que descarga la tipografía desde los
 * servidores de Google EN CADA BUILD. Eso significa que el build depende de
 * una conexión a internet y de que Google responda: si falla, el build se
 * cuelga o rompe. Ahora el archivo está en app/fonts/, así que el build no
 * sale a la red y además es más rápido.
 *
 * Es exactamente la misma tipografía y los mismos pesos, así que el sitio se
 * ve igual: es el archivo variable oficial (subconjunto latino, pesos 200 a
 * 800, que cubre los 400/500/600/700/800 que usa el diseño), y se expone con
 * la misma variable CSS de antes (--font-plus-jakarta), que es la que lee
 * globals.css.
 *
 * Licencia: SIL Open Font License 1.1 — permite usarla y redistribuirla.
 * El texto de la licencia está en app/fonts/LICENSE-PlusJakartaSans.txt.
 */
const plusJakartaSans = localFont({
  src: './fonts/plus-jakarta-sans-latin.woff2',
  weight: '200 800',
  style: 'normal',
  display: 'swap',
  variable: '--font-plus-jakarta',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
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
