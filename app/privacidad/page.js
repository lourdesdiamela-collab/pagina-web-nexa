import LegalPage from '@/components/LegalPage';
import LegalSecciones from '@/components/LegalSecciones';
import { privacidad } from '@/lib/textosLegales.mjs';
import { fechaVersion } from '@/lib/legal.mjs';

export const metadata = {
  title: 'Política de Privacidad | NEXA',
  description: 'Cómo NEXA trata los datos personales de quienes usan el sitio y contratan sus servicios.',
  alternates: { canonical: '/privacidad' },
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de Privacidad"
      intro="Qué datos personales recolecta NEXA, para qué los usa y cómo ejercer tus derechos sobre ellos."
    >
      <LegalSecciones secciones={privacidad()} version={fechaVersion()} />
    </LegalPage>
  );
}
