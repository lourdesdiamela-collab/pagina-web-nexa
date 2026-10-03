import LegalPage, { LegalEnPreparacion } from '@/components/LegalPage';

export const metadata = {
  title: 'Términos y Condiciones | NEXA',
  description: 'Términos y condiciones de contratación de los servicios y recursos digitales de NEXA.',
  alternates: { canonical: '/terminos' },
  robots: { index: false },
};

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos y Condiciones"
      intro="Condiciones de contratación de los servicios y de compra de los recursos digitales de NEXA."
    >
      <LegalEnPreparacion />
    </LegalPage>
  );
}
