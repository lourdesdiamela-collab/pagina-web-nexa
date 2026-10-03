import { prisma } from '@/lib/db';

/*
 * Clics de WhatsApp con su campaña de origen (herramienta #8).
 *
 * Cada fila es un clic en un botón de WhatsApp del sitio. El código "Ref."
 * es el mismo que aparece al final del mensaje que llega a WhatsApp, así que
 * para saber de dónde vino una consulta: copiar el código del chat y buscarlo
 * acá (Ctrl+F).
 *
 * Arriba hay un resumen de los últimos 30 días agrupado por campaña, para ver
 * qué anuncio está trayendo conversaciones.
 */

export const dynamic = 'force-dynamic';

const LOCATION_LABEL = {
  boton_flotante: 'Botón flotante',
  contacto: 'Página de contacto',
  contacto_error: 'Contacto (error del formulario)',
  servicio_card: 'Tarjeta de servicio',
  plan_card: 'Tarjeta de plan',
  servicios_cta: 'Servicios (cierre)',
  checkout: 'Checkout',
  checkout_transferencia: 'Checkout (transferencia)',
  checkout_fallido: 'Pago fallido',
};

function origen(c) {
  const partes = [c.utmSource, c.utmMedium, c.utmCampaign].filter(Boolean);
  if (partes.length) return partes.join(' / ');
  if (c.gclid) return 'Google Ads';
  if (c.fbclid) return 'Meta (Facebook / Instagram)';
  if (c.referrer) return `Referido: ${c.referrer}`;
  return 'Directo / sin campaña';
}

export default async function AdminWhatsAppPage() {
  let clicks = [];
  let resumen = [];
  let errorBase = null;

  try {
    clicks = await prisma.whatsAppClick.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
    const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ultimos = await prisma.whatsAppClick.findMany({ where: { createdAt: { gte: desde } } });
    const porOrigen = new Map();
    for (const c of ultimos) {
      const clave = origen(c);
      porOrigen.set(clave, (porOrigen.get(clave) || 0) + 1);
    }
    resumen = [...porOrigen.entries()].sort((a, b) => b[1] - a[1]);
  } catch (error) {
    console.error('No se pudieron leer los clics de WhatsApp:', error);
    errorBase = 'No se pudo leer la tabla de clics de WhatsApp. Se crea sola en el próximo deploy (prisma db push).';
  }

  return (
    <>
      <h1>WhatsApp</h1>
      <p className="admin-subtitle">
        {errorBase
          ? errorBase
          : 'Cada consulta de WhatsApp que sale del sitio llega con un código al final del mensaje, por ejemplo "(ref. W7K2QX)". Buscá ese código acá para ver de qué campaña vino.'}
      </p>

      {!errorBase && resumen.length > 0 && (
        <div className="aprende-admin-card" style={{ marginBottom: 20 }}>
          <div className="aprende-admin-table-wrap">
            <table className="aprende-admin-table">
              <thead>
                <tr><th>Origen (últimos 30 días)</th><th>Clics</th></tr>
              </thead>
              <tbody>
                {resumen.map(([clave, total]) => (
                  <tr key={clave}><td>{clave}</td><td><strong>{total}</strong></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!errorBase && clicks.length === 0 && (
        <div className="aprende-admin-card">
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>
            Todavía no hubo clics en WhatsApp desde que se activó el registro.
          </p>
        </div>
      )}

      {clicks.length > 0 && (
        <div className="aprende-admin-card">
          <div className="aprende-admin-table-wrap">
            <table className="aprende-admin-table">
              <thead>
                <tr><th>Fecha</th><th>Ref.</th><th>Origen</th><th>Anuncio</th><th>Botón</th><th>Página</th><th>Entró por</th></tr>
              </thead>
              <tbody>
                {clicks.map((c) => (
                  <tr key={c.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(c.createdAt).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.ref}</td>
                    <td style={{ fontSize: '0.8rem' }}>{origen(c)}</td>
                    <td style={{ fontSize: '0.8rem' }}>{c.utmContent || '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>{LOCATION_LABEL[c.location] || c.location}</td>
                    <td style={{ fontSize: '0.78rem' }}>{c.page || '—'}</td>
                    <td style={{ fontSize: '0.78rem' }}>{c.landingPage || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
