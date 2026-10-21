import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import ArrepentimientoForm from '../arrepentimiento/ArrepentimientoForm';

export const metadata = {
  title: 'Botón de Baja de servicio | NEXA',
  description: 'Pedido de baja de un servicio contratado en NEXA.',
  alternates: { canonical: '/baja' },
};

export default function BajaPage() {
  return (
    <LegalPage
      title="Botón de Baja de servicio"
      intro="Si querés dar de baja un servicio de NEXA, completá el formulario. No hace falta registrarte ni hacer otro trámite."
    >
      <p>
        Vas a recibir por correo electrónico la constancia con tu número de trámite dentro de las 24 horas. La baja corta
        los cobros siguientes según el aviso previsto en tu contrato (ver <Link href="/contratos">contratos de servicio</Link>).
      </p>
      <p>
        Si contrataste hace menos de 10 días corridos y querés que te devolvamos lo pagado, usá el{' '}
        <Link href="/arrepentimiento">Botón de Arrepentimiento</Link>.
      </p>
      <div style={{ marginTop: 32 }}>
        <ArrepentimientoForm tipo="baja" />
      </div>
    </LegalPage>
  );
}
