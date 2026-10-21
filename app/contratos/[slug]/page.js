import { notFound } from 'next/navigation';
import LegalPage from '@/components/LegalPage';
import LegalSecciones from '@/components/LegalSecciones';
import { CONTRATOS, getContrato } from '@/lib/contratos.mjs';
import { fechaVersion } from '@/lib/legal.mjs';

export function generateStaticParams() {
  return CONTRATOS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getContrato(slug);
  if (!c) return { title: 'Contrato no encontrado | NEXA' };
  return {
    title: `${c.titulo} | NEXA`,
    description: `Contrato de ${c.nombre}: alcance, cambios, plazos, pagos, renovación y baja.`,
    alternates: { canonical: `/contratos/${c.slug}` },
  };
}

export default async function ContratoPage({ params }) {
  const { slug } = await params;
  const c = getContrato(slug);
  if (!c) notFound();
  return (
    <LegalPage title={c.titulo} intro="Lo aceptás al contratar el servicio y te llega una copia completa por mail.">
      <LegalSecciones secciones={c.secciones} version={fechaVersion()} />
    </LegalPage>
  );
}
