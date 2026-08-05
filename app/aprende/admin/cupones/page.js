import { prisma } from '@/lib/db';
import { saveCoupon, deleteCoupon } from '@/lib/adminActions';

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <>
      <h1>Cupones</h1>
      <p className="admin-subtitle">Se aplican en el checkout con el campo "Cupón". El descuento es sobre el total ya calculado con las promociones automáticas.</p>

      <div className="aprende-admin-card">
        <h2>Cupones actuales</h2>
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Usos</th><th>Vence</th><th>Activo</th><th></th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td>{c.code}</td>
                  <td>{c.type === 'PERCENT' ? '% Porcentaje' : '$ Fijo'}</td>
                  <td>{c.type === 'PERCENT' ? `${c.value}%` : `$${c.value}`}</td>
                  <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td>{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-AR') : '—'}</td>
                  <td>
                    <form action={saveCoupon}>
                      <input type="hidden" name="id" value={c.id} />
                      <input type="hidden" name="code" value={c.code} />
                      <input type="hidden" name="type" value={c.type} />
                      <input type="hidden" name="value" value={c.value} />
                      <input type="hidden" name="expiresAt" value={c.expiresAt ? c.expiresAt.toISOString().slice(0, 10) : ''} />
                      <input type="hidden" name="usageLimit" value={c.usageLimit ?? ''} />
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <input type="checkbox" name="active" defaultChecked={c.active} />
                        <button type="submit" className="aprende-btn-mini">Guardar</button>
                      </label>
                    </form>
                  </td>
                  <td>
                    <form action={deleteCoupon}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="aprende-btn-mini danger">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="aprende-admin-card">
        <h2>Nuevo cupón</h2>
        <form action={saveCoupon} className="aprende-form" style={{ maxWidth: 560 }}>
          <div className="aprende-field">
            <label htmlFor="code">Código</label>
            <input id="code" name="code" required placeholder="VERANO20" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="aprende-field">
              <label htmlFor="type">Tipo</label>
              <select id="type" name="type" defaultValue="PERCENT">
                <option value="PERCENT">% Porcentaje</option>
                <option value="FIXED">$ Monto fijo</option>
              </select>
            </div>
            <div className="aprende-field">
              <label htmlFor="value">Valor</label>
              <input id="value" name="value" type="number" min="0" required placeholder="10" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="aprende-field">
              <label htmlFor="expiresAt">Vence (opcional)</label>
              <input id="expiresAt" name="expiresAt" type="date" />
            </div>
            <div className="aprende-field">
              <label htmlFor="usageLimit">Límite de usos (opcional)</label>
              <input id="usageLimit" name="usageLimit" type="number" min="1" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
            <input type="checkbox" name="active" defaultChecked /> Activo
          </label>
          <button type="submit" className="btn btn-primary">Crear cupón</button>
        </form>
      </div>
    </>
  );
}
