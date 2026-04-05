import { getSession } from '@/lib/auth';
import { listFollowups, listPayments } from '@/lib/crm';
import { FileText, Link2 } from 'lucide-react';

export default async function ClientFilesPage() {
  const session = await getSession();
  const [followups, payments] = await Promise.all([
    listFollowups({ clientId: session.clientId }),
    listPayments({ clientId: session.clientId }),
  ]);

  const files = [
    ...followups.flatMap((item) =>
      (item.attachments || []).map((url, index) => ({
        id: `${item.id}-attachment-${index}`,
        label: `Adjunto de seguimiento`,
        description: item.comment || 'Archivo adjunto',
        url,
      })),
    ),
    ...payments
      .filter((payment) => payment.attachmentUrl)
      .map((payment) => ({
        id: `${payment.id}-receipt`,
        label: `Comprobante de pago`,
        description: payment.concept,
        url: payment.attachmentUrl,
      })),
  ];

  return (
    <div>
      <header style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={22} color="#D2F23A" /> Documentos
        </h2>
        <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.66)' }}>Archivos y comprobantes cargados por el equipo.</p>
      </header>

      <article style={panelStyle}>
        {files.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>Aun no hay archivos asociados a tu cuenta.</p>}
        {files.length > 0 && (
          <div style={{ display: 'grid', gap: 8 }}>
            {files.map((file) => (
              <div key={file.id} style={itemStyle}>
                <div>
                  <strong>{file.label}</strong>
                  <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{file.description}</div>
                </div>
                <a href={file.url} target="_blank" rel="noreferrer" style={linkStyle}>
                  <Link2 size={14} /> Abrir
                </a>
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

const panelStyle = {
  borderRadius: 16,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.04)',
  padding: 14,
};

const itemStyle = {
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(13,14,21,0.6)',
  padding: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 10,
};

const linkStyle = {
  borderRadius: 10,
  border: '1px solid rgba(184,155,255,0.45)',
  background: 'rgba(184,155,255,0.16)',
  color: 'white',
  padding: '7px 10px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
};
