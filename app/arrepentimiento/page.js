import LegalPage, { LegalPlaceholder } from '@/components/LegalPage';

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
      intro="Si te arrepentiste de una compra o contratación, acá podés pedir que se revoque."
    >
      <LegalPlaceholder nota="Mientras el texto no esté cargado, esta página está marcada como no indexable (robots: noindex). Cuando cargues el texto, sacá la línea robots de la metadata en app/arrepentimiento/page.js." />
    </LegalPage>
  );
}
