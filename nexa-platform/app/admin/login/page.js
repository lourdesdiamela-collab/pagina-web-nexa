'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { NexaLogo } from '@/components/NexaLogo';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      if (data.user.role === 'client') {
        setError('Acceso denegado. Estás intentando ingresar al panel administrativo con una cuenta de cliente.');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
    } catch { setError('Error de conexión.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F4FA', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}><NexaLogo size={48} /></div>
          <h1 style={{ color: '#12141D', fontSize: '1.8rem', fontWeight: 800 }}>Panel Interno</h1>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Acceso exclusivo para equipo NEXA.</p>
        </div>

        <form onSubmit={handleLogin} style={{
          background: 'white',
          border: '1px solid rgba(184, 155, 255, 0.3)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(184, 155, 255, 0.1)',
        }}>
          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', color: '#d32f2f', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div className="form-field" style={{ marginBottom: '20px' }}>
            <label style={{ color: '#12141D', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>Email corporativo</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="tu@nexagrowth.com.ar"
              style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#12141D', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div className="form-field" style={{ marginBottom: '30px', position: 'relative' }}>
            <label style={{ color: '#12141D', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>Contraseña</label>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '16px 50px 16px 20px', borderRadius: '14px', border: '1px solid #E5E5E5', background: '#F9F9F9', color: '#12141D', fontSize: '1rem', outline: 'none' }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '42px', color: '#999' }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '18px', borderRadius: '16px',
            background: loading ? '#ccc' : '#12141D',
            color: 'white', fontSize: '1rem', fontWeight: 800,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.3s'
          }}>
            <LogIn size={18} /> {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
