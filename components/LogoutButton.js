'use client';
import { LogOut } from 'lucide-react';

export default function LogoutButton({ isAdmin }) {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = isAdmin ? '/admin/login' : '/';
  };

  return (
    <button onClick={handleLogout} style={{
      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
      padding: '10px 14px', color: '#ff6b6b', fontSize: '0.85rem', fontWeight: 600,
      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      borderRadius: '12px', transition: 'background 0.2s'
    }} className="logout-btn">
      <LogOut size={16} /> Cerrar sesión
    </button>
  );
}
