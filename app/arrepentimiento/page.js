import LegalPage from '@/components/LegalPage';
import ArrepentimientoForm from './ArrepentimientoForm';

export const metadata = {
  title: 'Botón de Arrepentimiento | NEXA',
  description: 'Solicitud de revocación de una compra o contratación realizada en NEXA.',
  alternates: { canonical: '/arrepentimiento' },
};

export default function ArrepentimientoPage() {
  return (
    <LegalPage
      title="Botón de Arrepentimiento"
      intro="Si te arrepentiste de una compra o contratación, completá el formulario y te vamos a contactar."
    >
      <p>
        Si compraste un producto o contrataste un servicio a distancia, tenés derecho a arrepentirte dentro de los
        10 días corridos, contados desde que recibiste el producto o desde que contrataste el servicio, lo que haya
        ocurrido último. Este derecho está previsto en el artículo 1110 del Código Civil y Comercial de la Nación y
        en la Ley 24.240 de Defensa del Consumidor.
      </p>
      <p>
        Para ejercerlo no necesitás justificar el motivo ni hacerte cargo de ningún costo. Completá el formulario
        que está más abajo y vas a recibir por correo electrónico la constancia con tu número de trámite.
      </p>
      <p>
        Una vez recibida la solicitud nos vamos a comunicar con vos para confirmar los datos y procesar la
        devolución por el mismo medio de pago que hayas utilizado.
      </p>
      <p>
        Si tenés cualquier duda antes de completarlo, escribinos y te ayudamos.
      </p>
      <div style={{ marginTop: 32 }}>
        <ArrepentimientoForm />
      </div>
    </LegalPage>
  );
}
