import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata = {
  title: 'NEXA — Marketing, ventas y procesos para tu negocio',
  description: 'Agencia de marketing integral, CRM operativo y automatización comercial. Estrategia, contenido, captación y seguimiento real para escalar tu marca.',
  keywords: ['marketing digital', 'agencia marketing', 'CRM', 'automatización', 'NEXA', 'Argentina'],
  authors: [{ name: 'NEXA' }],
  openGraph: {
    title: 'NEXA — Marketing, ventas y procesos para tu negocio',
    description: 'Agencia de marketing integral, CRM operativo y automatización comercial.',
    url: 'https://nexagrowth.com.ar',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXA — Marketing, ventas y procesos para tu negocio',
    description: 'Agencia de marketing integral, CRM operativo y automatización comercial.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  );
}
