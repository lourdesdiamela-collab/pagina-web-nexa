import { prisma } from '@/lib/db';
import { formatPrice } from '@/lib/products.mjs';
import { resyncLeadToCrm } from '@/lib/adminActions';

/*
 * Consultas y pedidos que entraron por el sitio.
 *
 * Hasta septiembre de 2026 estos leads no se guardaban en ningún lado
 * (lib/crm.js era un stub): el único registro eran los emails. Esta pantalla
 * existe para que Lu pueda verlos sin depender de la casilla de correo.
 */

const SOURCE_LABEL = {
  formulario_contacto: 'Formulario de contacto',
  checkout_servicio_transferencia: 'Checkout servicios (transferencia)',
  checkout_servicio_mercadopago: 'Checkout servicios (Mercado Pago)',
};

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  let leads = [];
  let errorBase = null;

  try {
    leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
  } catch (error) {
    console.error('No se pudieron leer los leads:', error);
    errorBase = 'No se pudo leer la tabla de consultas. Si es la primera vez, falta correr las migraciones: npx prisma migrate deploy';
  }

  const pendientes = leads.filter((l) => !l.syncedToCrm).length;

  return (
    <>
      <h1>Consultas</h1>
      <p className="admin-subtitle">
        {errorBase
          ? errorBase
          : `${leads.length} consultas (últimas 300). ${pendientes} sin sincronizar con el CRM central — los pagos de servicio (con botón "Reintentar") se pueden reintentar acá; el resto hay que pasarlo a mano.`}
      </p>

      {!errorBase && leads.length === 0 && (
        <div className="aprende-admin-card">
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>
            Todavía no entró ninguna consulta por el sitio.
          </p>
        </div>
      )}

      {leads.length > 0 && (
        <div className="aprende-admin-card">
          <div className="aprende-admin-table-wrap">
            <table className="aprende-admin-table">
              <thead>
                <tr>
                  <th>Fecha</th><th>Nombre</th><th>Contacto</th><th>Empresa</th>
                  <th>Interés</th><th>Mensaje</th><th>Origen</th><th>CRM</th><th></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(l.createdAt).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                    </td>
                    <td>{l.name}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {l.email}
                      {l.phone && <><br /><span style={{ color: 'var(--text-muted)' }}>{l.phone}</span></>}
                    </td>
                    <td>{l.company || '—'}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {l.service || '—'}
                      {l.amount ? <><br /><strong>{formatPrice(l.amount)}</strong></> : null}
                      {l.reference && <><br /><span style={{ color: 'var(--text-muted)' }}>{l.reference}</span></>}
                    </td>
                    <td style={{ fontSize: '0.8rem', maxWidth: 320 }}>{l.message || '—'}</td>
                    <td style={{ fontSize: '0.78rem' }}>{SOURCE_LABEL[l.source] || l.source}</td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {l.syncedToCrm ? 'Sincronizado' : 'Pendiente'}
                      {!l.syncedToCrm && l.syncError && (
                        <div style={{ color: 'var(--red, #d33)', fontSize: '0.72rem', marginTop: 2 }}>{l.syncError}</div>
                      )}
                    </td>
                    <td>
                      {!l.syncedToCrm && l.mpPaymentId && (
                        <form action={resyncLeadToCrm}>
                          <input type="hidden" name="id" value={l.id} />
                          <button type="submit" className="btn btn-outline btn-sm">Reintentar</button>
                        </form>
                      )}
                    </td>
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
