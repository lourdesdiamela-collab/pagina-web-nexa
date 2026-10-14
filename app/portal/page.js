import { redirect } from 'next/navigation';

/*
 * Dinámica a propósito: el destino sale de NEXT_PUBLIC_CRM_URL y se lee en
 * cada request. Si la página se prerenderizara, la URL del CRM quedaría
 * congelada en el momento del build.
 *
 * (Esta directiva estaba antes en el layout raíz, donde dejaba sin caché a
 * todo el sitio. Ver el comentario en app/layout.js.)
 */
export const dynamic = 'force-dynamic';

export default function PortalRedirect() {
  const crmUrl = process.env.NEXT_PUBLIC_CRM_URL || 'https://crm.nexagrowth.com.ar';
  redirect(`${crmUrl}/login`);
}
