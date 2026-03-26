import './globals.css';

export const metadata = {
  title: 'NEXA — Estudio de Marketing y Crecimiento',
  description: 'Estrategia, contenido, campañas y crecimiento para marcas y negocios que quieren construir una presencia más sólida.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
