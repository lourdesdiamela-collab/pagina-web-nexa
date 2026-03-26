import { CheckSquare } from 'lucide-react';

export default function ClientEntregasPage() {
  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckSquare color="#B89BFF" /> Pendientes y Entregas
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '8px' }}>
          Seguí el estado de tus campañas, reportes y materiales que estamos produciendo.
        </p>
      </header>

      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '60px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
        <CheckSquare size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '10px' }}>Tu historial de entregas está vacío</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto' }}>A medida que NEXA avance con tu estrategia, verás tus entregables aquí.</p>
      </div>
    </div>
  );
}
