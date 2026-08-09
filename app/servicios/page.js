import ServiciosClient from './ServiciosClient';

export const metadata = {
  title: 'Servicios | Marketing, Redes, Ads, CRM y Web — NEXA',
  description: 'Marketing y estrategia, redes sociales, campañas de Meta/Google Ads, CRM y seguimiento comercial, sitios web y reactivación de clientes. Precios fijos y públicos.',
  alternates: {
    canonical: '/servicios',
  },
  openGraph: {
    title: 'Servicios | Marketing, Redes, Ads, CRM y Web — NEXA',
    description: 'Marketing y estrategia, redes sociales, campañas de Meta/Google Ads, CRM y seguimiento comercial, sitios web y reactivación de clientes. Precios fijos y públicos.',
    url: '/servicios',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function ServiciosPage() {
  return <ServiciosClient />;
}
