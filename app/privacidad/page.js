import LegalPage, { LegalEnPreparacion } from '@/components/LegalPage';

export const metadata = {
  title: 'Política de Privacidad | NEXA',
  description: 'Cómo NEXA trata los datos personales de quienes usan el sitio y contratan sus servicios.',
  alternates: { canonical: '/privacidad' },
  robots: { index: false },
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de Privacidad"
      intro="Qué datos personales recolecta NEXA, para qué los usa y cómo ejercer tus derechos sobre ellos."
    >
      <LegalEnPreparacion />
    </LegalPage>
  );
}
