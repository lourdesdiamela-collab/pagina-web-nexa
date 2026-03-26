import { CheckSquare, Plus } from 'lucide-react';

export default function AdminTareasPage() {
  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ color: '#12141D', fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckSquare color="#B89BFF" /> Gestión de Tareas
          </h1>
          <p style={{ color: '#666', fontSize: '1rem', marginTop: '8px' }}>
            Monitoreo de tareas internas y seguimiento de entregas por cliente.
          </p>
        </div>
        <button style={{
          background: '#12141D', color: 'white', padding: '12px 24px', borderRadius: '12px',
          fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.5
        }} disabled>
          <Plus size={18} /> Nueva Tarea
        </button>
      </header>

      <div style={{ background: 'white', borderRadius: '24px', padding: '60px', textAlign: 'center', border: '1px solid #EEE' }}>
        <CheckSquare size={48} color="#EEE" style={{ marginBottom: '20px' }} />
        <h2 style={{ fontSize: '1.2rem', color: '#12141D', marginBottom: '10px' }}>Módulo en Construcción</h2>
        <p style={{ color: '#666' }}>Las tareas se migrarán a la nueva base de datos en la próxima fase.</p>
      </div>
    </div>
  );
}
