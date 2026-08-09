import CasosClient from './CasosClient';

export const metadata = {
  title: 'Casos de Éxito | NEXA',
  description: 'Resultados reales de marcas que trabajaron con NEXA: más reservas, más ventas online y más turnos agendados con estrategia y ejecución de marketing digital.',
  alternates: {
    canonical: '/casos',
  },
  openGraph: {
    title: 'Casos de Éxito | NEXA',
    description: 'Resultados reales de marcas que trabajaron con NEXA: más reservas, más ventas online y más turnos agendados con estrategia y ejecución de marketing digital.',
    url: '/casos',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function CasosPage() {
  return <CasosClient />;
}
