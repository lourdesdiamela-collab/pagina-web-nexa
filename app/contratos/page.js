import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { CONTRATOS } from '@/lib/contratos.mjs';
import { fechaVersion } from '@/lib/legal.mjs';

export const metadata = {
  title: 'Contratos de servicio | NEXA',
  description: 'Contratos de cada servicio de NEXA: alcance, cambios, plazos, pagos, renovación y baja.',
  alternates: { canonical: '/contratos' },
};

export default function ContratosPage() {
  return (
    <LegalPage
      title="Contratos de servicio"
      intro="Cada servicio tiene su contrato. Lo aceptás al contratar y te llega una copia completa por mail."
    >
      <p className="legal-version">Versión vigente: {fechaVersion()}</p>
      <ul>
        {CONTRATOS.map((c) => (
          <li key={c.slug}>
            <Link href={`/contratos/${c.slug}`}>{c.nombre}</Link>
            {c.mensual ? ' — abono mensual' : ' — pago único'}
          </li>
        ))}
      </ul>
      <p>
        Estos contratos se complementan con los <Link href="/terminos">Términos y Condiciones</Link> y la{' '}
        <Link href="/privacidad">Política de Privacidad</Link>.
      </p>
    </LegalPage>
  );
}
