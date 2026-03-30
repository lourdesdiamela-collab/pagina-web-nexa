import { getSession } from '@/lib/auth';
import { listPayments } from '@/lib/crm';
import { CircleDollarSign } from 'lucide-react';

function money(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0);
}

export default async function ClientPaymentsPage() {
  const session = await getSession();
  const payments = await listPayments({ clientId: session.clientId });

  const pending = payments.filter((payment) => ['pending', 'overdue'].includes(payment.status));
  const paid = payments.filter((payment) => payment.status === 'paid');

  return (
    <div>
      <header style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CircleDollarSign size={22} color="#D2F23A" /> Pagos
        </h2>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Detalle de facturacion y estado de cobros.</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Pagado</div>
          <strong style={cardValueStyle}>{money(paid.reduce((sum, payment) => sum + Number(payment.amount || 0), 0))}</strong>
        </article>
        <article style={cardStyle}>
          <div style={cardLabelStyle}>Pendiente</div>
          <strong style={{ ...cardValueStyle, color: '#ffb97a' }}>{money(pending.reduce((sum, payment) => sum + Number(payment.amount || 0), 0))}</strong>
        </article>
      </section>

      <article style={panelStyle}>
        {payments.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No hay comprobantes para mostrar.</p>}
        {payments.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: 8 }}>Concepto</th>
                  <th style={{ padding: 8 }}>Metodo</th>
                  <th style={{ padding: 8 }}>Vencimiento</th>
                  <th style={{ padding: 8 }}>Estado</th>
                  <th style={{ padding: 8, textAlign: 'right' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: 8 }}>{payment.concept}</td>
                    <td style={{ padding: 8 }}>{payment.method || '-'}</td>
                    <td style={{ padding: 8 }}>{payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('es-AR') : '-'}</td>
                    <td style={{ padding: 8, color: payment.status === 'paid' ? '#7ef0b3' : '#ffb97a' }}>{payment.status}</td>
                    <td style={{ padding: 8, textAlign: 'right' }}>{money(payment.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}

const cardStyle = {
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.04)',
  padding: 12,
};

const cardLabelStyle = {
  color: 'rgba(255,255,255,0.65)',
  fontSize: '0.84rem',
};

const cardValueStyle = {
  fontSize: '1.45rem',
  display: 'block',
  marginTop: 4,
};

const panelStyle = {
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  padding: 14,
};
