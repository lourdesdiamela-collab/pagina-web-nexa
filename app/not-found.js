'use client';
import Link from 'next/link';
import { NexaLogo } from '@/components/NexaLogo';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0D0E15', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      color: 'white',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <NexaLogo size={60} color="white" />
        </div>
        <h1 style={{ fontSize: '6rem', fontWeight: 900, color: '#B89BFF', marginBottom: '10px', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '24px' }}>Página no encontrada</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', marginBottom: '40px', lineHeight: 1.6 }}>
          Parece que intentaste acceder a un rincón de NEXA que no existe o fue movido. 
          Si buscabas el portal de clientes, hacé clic debajo.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={18} /> Volver al Inicio
          </Link>
          <Link href="/portal" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Ir al Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
