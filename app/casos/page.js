import CasosClient from './CasosClient';

/*
 * NOTA (septiembre 2026): la metadata decía "Casos de Éxito — Resultados
 * reales de marcas que trabajaron con NEXA: más reservas, más ventas online y
 * más turnos agendados". Era falsa: NEXA no tiene clientes todavía. Se
 * reescribió describiendo el enfoque de trabajo, sin afirmar resultados.
 *
 * La ruta sigue siendo /casos para no romper links ya publicados. Si querés
 * que la página no exista más, hay que borrar la carpeta app/casos/ y sacar el
 * link de components/Navbar.js y components/Footer.js.
 */
export const metadata = {
  title: 'Nuestro enfoque | NEXA',
  description: 'Cómo trabaja NEXA el marketing digital de un negocio: diagnóstico, plan, ejecución y medición con datos reales.',
  alternates: {
    canonical: '/casos',
  },
  openGraph: {
    title: 'Nuestro enfoque | NEXA',
    description: 'Cómo trabaja NEXA el marketing digital de un negocio: diagnóstico, plan, ejecución y medición con datos reales.',
    url: '/casos',
    siteName: 'NEXA',
    locale: 'es_AR',
    type: 'website',
  },
};

export default function CasosPage() {
  return <CasosClient />;
}
