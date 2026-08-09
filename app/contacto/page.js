import ContactoClient from './ContactoClient';

export const metadata = {
  title: 'Contacto | NEXA Marketing Digital',
  description: 'Contactá al equipo de NEXA para profesionalizar tu marketing, ordenar tu captura de leads y escalar tu negocio. Te respondemos en menos de 24 horas.',
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto | NEXA Marketing Digital',
    description: 'Contactá al equipo de NEXA para profesionalizar tu marketing, ordenar tu captura de leads y escalar tu negocio.',
    url: '/contacto',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function ContactoPage() {
  return <ContactoClient />;
}
