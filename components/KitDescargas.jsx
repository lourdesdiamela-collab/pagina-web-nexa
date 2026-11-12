import { Download, ExternalLink, FileText, PlayCircle, LayoutTemplate } from 'lucide-react';

const ICONOS = { guia: LayoutTemplate, pdf: FileText, video: PlayCircle };

const card = {
  background: '#fff', border: '1px solid #E9E2F3', borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)',
  boxShadow: '0 12px 40px rgba(131,92,230,0.10)',
};

// Lista de archivos del kit comprado, con enlaces firmados (ver lib/kitsAcceso.js).
export default function KitDescargas({ kit, token }) {
  const url = (id, ver) => `/api/kits/archivo?t=${encodeURIComponent(token)}&f=${id}${ver ? '&ver=1' : ''}`;
  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {kit.archivos.map((a) => {
        const Icono = ICONOS[a.id] || FileText;
        return (
          <div key={a.id} style={{ ...card, padding: 18, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ width: 48, height: 48, borderRadius: 14, background: '#F3EEF8', color: '#835CE6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icono size={24} />
            </span>
            <div style={{ flex: '1 1 220px', minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#12141D' }}>{a.titulo}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.95rem', color: '#505466', lineHeight: 1.5 }}>{a.detalle}</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {a.abrirOnline && (
                <a className="btn btn-primary" href={url(a.id, true)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} /> Abrir
                </a>
              )}
              <a className="btn btn-outline" href={url(a.id, false)}>
                <Download size={16} /> Descargar
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const estiloTarjeta = card;
