import { FileText } from 'lucide-react';

export default function ClientArchivosPage() {
  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText color="#B89BFF" /> Documentos Importantes
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '8px' }}>
          Contratos, manuales de marca y carpetas compartidas con NEXA.
        </p>
      </header>

      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '60px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
        <FileText size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '10px' }}>No hay documentos todavía</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto' }}>Pronto sincronizaremos tu carpeta compartida de NEXA en este espacio.</p>
      </div>
    </div>
  );
}
