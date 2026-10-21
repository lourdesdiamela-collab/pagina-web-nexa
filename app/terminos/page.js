import LegalPage from '@/components/LegalPage';
import LegalSecciones from '@/components/LegalSecciones';
import { terminos } from '@/lib/textosLegales.mjs';
import { fechaVersion } from '@/lib/legal.mjs';

export const metadata = {
  title: 'Términos y Condiciones | NEXA',
  description: 'Términos y condiciones de contratación de los servicios y recursos digitales de NEXA.',
  alternates: { canonical: '/terminos' },
};

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos y Condiciones"
      intro="Condiciones de uso del sitio, de contratación de los servicios y de compra de los recursos digitales de NEXA."
    >
      <LegalSecciones secciones={terminos()} version={fechaVersion()} />
    </LegalPage>
  );
}
