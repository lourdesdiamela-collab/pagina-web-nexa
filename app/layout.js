import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'NEXA - Plataforma de marketing y CRM operativo',
  description: 'Web publica y CRM de NEXA con gestion real de clientes, tareas, pagos y seguimiento.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={plusJakartaSans.variable}>
      <body>{children}</body>
    </html>
  );
}
