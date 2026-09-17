import { prisma } from '@/lib/db';
import { resyncArrepentimientoToCrm } from '@/lib/adminActions';

/*
 * Solicitudes de arrepentimiento que entraron por /arrepentimiento.
 *
 * Esta pantalla solo muestra si cada caso llegó al CRM o no, con botón para
 * reintentar -- la gestión del caso (ver detalle completo, cambiar estado)
 * vive en el CRM central (Nexa-CRM → Solicitudes de arrepentimiento), igual
 * que "Pagos automáticos" allá. Acá el objetivo es que un caso nunca se
 * pierda si la sincronización falló.
 */

export const dynamic = 'force-dynamic';

export default async function AdminArrepentimientoPage() {
  let casos = [];
  let errorBase = null;

  try {
    casos = await prisma.arrepentimientoRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 300 });
  } catch (error) {
    console.error('No se pudieron leer las solicitudes de arrepentimiento:', error);
    errorBase = 'No se pudo leer la tabla de solicitudes. Si es la primera vez, falta correr las migraciones.';
  }

  const pendientes = casos.filter((c) => !c.syncedToCrm).length;

  return (
    <>
      <h1>Solicitudes de arrepentimiento</h1>
      <p className="admin-subtitle">
        {errorBase
          ? errorBase
          : `${casos.length} solicitudes (últimas 300). ${pendientes} sin sincronizar con el CRM. La gestión del caso (cambiar estado) se hace desde el CRM central.`}
      </p>

      {!errorBase && casos.length === 0 && (
        <div className="aprende-admin-card">
          <p style={{ padding: 20, color: 'var(--text-muted)' }}>
            Todavía no entró ninguna solicitud de arrepentimiento.
          </p>
        </div>
      )}

      {casos.length > 0 && (
        <div className="aprende-admin-card">
          <div className="aprende-admin-table-wrap">
            <table className="aprende-admin-table">
              <thead>
                <tr>
                  <th>Fecha</th><th>N° trámite</th><th>Nombre</th><th>Contacto</th>
                  <th>Compra</th><th>Motivo</th><th>CRM</th><th></th>
                </tr>
              </thead>
              <tbody>
                {casos.map((c) => (
                  <tr key={c.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                      {new Date(c.createdAt).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}
                    </td>
                    <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.numero}</td>
                    <td>{c.nombre}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      {c.email}
                      {c.telefono && <><br /><span style={{ color: 'var(--text-muted)' }}>{c.telefono}</span></>}
                    </td>
                    <td style={{ fontSize: '0.8rem', maxWidth: 220 }}>{c.identificacionCompra}</td>
                    <td style={{ fontSize: '0.8rem', maxWidth: 220 }}>{c.motivo || '—'}</td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {c.syncedToCrm ? 'Sincronizado' : 'Pendiente'}
                      {!c.syncedToCrm && c.syncError && (
                        <div style={{ color: 'var(--red, #d33)', fontSize: '0.72rem', marginTop: 2 }}>{c.syncError}</div>
                      )}
                    </td>
                    <td>
                      {!c.syncedToCrm && (
                        <form action={resyncArrepentimientoToCrm}>
                          <input type="hidden" name="id" value={c.id} />
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
