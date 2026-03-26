import { CreditCard } from 'lucide-react';

export default function ClientPagosPage() {
  return (
    <div>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CreditCard color="#B89BFF" /> Facturación
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '8px' }}>
          Tu historial de pagos, recibos de servicios activos y presupuestos.
        </p>
      </header>

      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '24px', padding: '60px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
        <CreditCard size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.2rem', color: 'white', marginBottom: '10px' }}>Facturación al día</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto' }}>No tenés ningún saldo pendiente con NEXA Growth en este momento.</p>
      </div>
    </div>
  );
}
