import LegalPage, { LegalPlaceholder } from '@/components/LegalPage';
import ArrepentimientoForm from './ArrepentimientoForm';

export const metadata = {
  title: 'Botón de Arrepentimiento | NEXA',
  description: 'Solicitud de revocación de una compra o contratación realizada en NEXA.',
  alternates: { canonical: '/arrepentimiento' },
  robots: { index: false },
};

export default function ArrepentimientoPage() {
  return (
    <LegalPage
      title="Botón de Arrepentimiento"
      intro="Si te arrepentiste de una compra o contratación, completá el formulario y te vamos a contactar."
    >
      <LegalPlaceholder nota="Mientras el texto no esté cargado, esta página está marcada como no indexable (robots: noindex). Cuando cargues el texto, sacá la línea robots de la metadata en app/arrepentimiento/page.js. El formulario de abajo ya funciona independientemente de este texto." />
      <div style={{ marginTop: 32 }}>
        <ArrepentimientoForm />
      </div>
    </LegalPage>
  );
}
