'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { NexaLogo } from '@/components/NexaLogo';

export default function ClientLogin() {
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
      router.push(data.redirect);
    } catch { setError('Error de conexión.'); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0E15', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-block', marginBottom: '30px' }}><NexaLogo size={40} color="white" /></Link>
          <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Área Clientes</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
            Ingresá con tus credenciales para acceder a tu panel personalizado.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '40px',
        }}>
          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '20px', color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-field" style={{ marginBottom: '20px' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="tu@email.com"
              style={{ width: '100%', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
          </div>

          <div className="form-field" style={{ marginBottom: '10px', position: 'relative' }}>
            <label style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', display: 'block' }}>Contraseña</label>
            <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '16px 50px 16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'white', fontSize: '1rem', outline: 'none' }}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '16px', top: '42px', color: 'rgba(255,255,255,0.4)' }}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link href="/clientes/recuperar" style={{ color: '#B89BFF', fontSize: '0.85rem', fontWeight: 600 }}>¿Olvidaste tu contraseña?</Link>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '18px', borderRadius: '16px',
            background: loading ? 'rgba(255,255,255,0.1)' : '#12141D',
            color: 'white', fontSize: '1rem', fontWeight: 800,
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.3s'
          }}>
            <LogIn size={18} /> {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Volver a nexagrowth.com.ar
          </Link>
        </div>
      </div>
    </div>
  );
}
