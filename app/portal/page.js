'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, Eye, EyeOff, Building2, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react';
import { NexaLogo } from '@/components/NexaLogo';

export default function PortalAcceso() {
  const router = useRouter();
  
  // States: 'login' | 'register'
  const [view, setView] = useState('login');
  
  // Sub-states
  const [role, setRole] = useState('client'); // 'client' | 'admin'
  
  // Forms forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      router.push(data.redirect);
    } catch {
      setError('Error de conectividad con nuestros servidores.');
      setLoading(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, company, role, inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      
      // Auto login after register
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok) {
        router.push(loginData.redirect);
      } else {
        setView('login');
      }
    } catch {
      setError('Error de conectividad con nuestros servidores.');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: role === 'client' ? '#0D0E15' : '#F8F4FA',
      transition: 'background 0.5s ease',
      fontFamily: 'Inter, sans-serif'
    }}>
      <title>{view === 'login' ? 'Iniciar Sesión — NEXA' : 'Crear Cuenta — NEXA'}</title>
      
      {/* Left Area - High Impact Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        position: 'relative',
        overflow: 'hidden',
        borderRight: role === 'client' ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Background Visual */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {role === 'client' ? (
            <>
              <img src="/nexa-hero.png" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, filter: 'grayscale(100%) brightness(0.5)' }} alt="" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0D0E15, transparent)' }} />
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(184, 155, 255, 0.1) 0%, transparent 70%)' }} />
          )}
        </div>

        <div style={{ position: 'absolute', top: 40, left: 60, zIndex: 20 }}>
          <Link href="/">
            <NexaLogo size={48} color={role === 'client' ? 'white' : '#12141D'} />
          </Link>
        </div>

        <div style={{ maxWidth: '600px', zIndex: 10, position: 'relative' }}>
          <div style={{ 
            display: 'inline-flex', padding: '6px 12px', background: role === 'client' ? 'rgba(184, 155, 255, 0.1)' : 'rgba(0,0,0,0.05)', 
            borderRadius: '100px', color: role === 'client' ? '#B89BFF' : '#666', fontSize: '0.8rem', fontWeight: 800, 
            textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' 
          }}>
            Plataforma Unificada v2.0
          </div>
          <h1 style={{ 
            fontSize: '4.5rem', 
            fontWeight: 900, 
            lineHeight: 0.95,
            letterSpacing: '-0.06em',
            marginBottom: '30px',
            color: role === 'client' ? 'white' : '#12141D'
          }}>
            {role === 'client' ? 'Bienvenido a tu área de crecimiento.' : 'Gestión estratégica interna.'}
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            lineHeight: 1.6,
            color: role === 'client' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            fontWeight: 500
          }}>
            {role === 'client' 
              ? 'Centralizamos tus reportes, métricas y facturación en un solo lugar diseñado para potenciar los resultados de tu marca.'
              : 'Acceso a la infraestructura de control de campañas, gestión de clientes y monitoreo de ROI de NEXA.'}
          </p>
        </div>
      </div>

      {/* Right Area - Glassmorphism Forms */}
      <div style={{
        width: '550px',
        background: role === 'client' ? '#12141D' : 'white',
        boxShadow: role === 'client' ? '-20px 0 80px rgba(0,0,0,0.8)' : '-20px 0 80px rgba(184, 155, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 60px',
        position: 'relative',
        zIndex: 50
      }}>
        
        {/* Toggle Mode Register / Login */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '40px', borderBottom: role === 'client' ? '1px solid rgba(255,255,255,0.1)' : '1px solid #EEE', paddingBottom: '24px' }}>
          <button 
            onClick={() => { setView('login'); setError(''); }}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 900,
              color: view === 'login' ? (role === 'client' ? 'white' : '#12141D') : (role === 'client' ? 'rgba(255,255,255,0.3)' : '#BBB'),
              transition: 'all 0.3s', position: 'relative'
            }}>
            Ingresar
            {view === 'login' && <div style={{ position: 'absolute', bottom: -26, left: 0, width: '100%', height: 4, background: role === 'client' ? '#D2F23A' : '#12141D', borderRadius: '4px' }} />}
          </button>
          <button 
            onClick={() => { setView('register'); setError(''); }}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 900,
              color: view === 'register' ? (role === 'client' ? 'white' : '#12141D') : (role === 'client' ? 'rgba(255,255,255,0.3)' : '#BBB'),
              transition: 'all 0.3s', position: 'relative'
            }}>
            Crear Cuenta
            {view === 'register' && <div style={{ position: 'absolute', bottom: -26, left: 0, width: '100%', height: 4, background: role === 'client' ? '#D2F23A' : '#12141D', borderRadius: '4px' }} />}
          </button>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'flex', background: role === 'client' ? 'rgba(255,255,255,0.05)' : '#F5F5F7', borderRadius: '18px', padding: '6px', marginBottom: '35px' }}>
          <button 
            type="button"
            onClick={() => { setRole('client'); setError(''); }}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: 'none', fontSize: '0.95rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer',
              background: role === 'client' ? 'white' : 'transparent',
              color: role === 'client' ? '#12141D' : '#999',
              boxShadow: role === 'client' ? '0 10px 20px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <Building2 size={18} /> Soy Cliente
          </button>
          <button 
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            style={{
              flex: 1, padding: '14px', borderRadius: '14px', border: 'none', fontSize: '0.95rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer',
              background: role === 'admin' ? '#12141D' : 'transparent',
              color: role === 'admin' ? 'white' : 'rgba(255,255,255,0.3)',
              boxShadow: role === 'admin' ? '0 10px 20px rgba(0,0,0,0.2)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            <NexaLogo size={18} color={role === 'admin' ? 'white' : 'rgba(255,255,255,0.3)'} /> Admin
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '16px', padding: '18px', marginBottom: '30px', color: '#ff6b6b', fontSize: '0.95rem', fontWeight: 600, textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={submitLogin}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: role === 'client' ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'block' }}>Correo Electrónico</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="ejemplo@marca.com"
                style={{ width: '100%', padding: '18px 24px', borderRadius: '16px', border: '2px solid transparent', background: role === 'client' ? 'rgba(255,255,255,0.04)' : '#F9F9FB', color: role === 'client' ? 'white' : '#12141D', fontSize: '1rem', outline: 'none', transition: 'all 0.3s', focus: { borderColor: '#B89BFF' } }}
                className="input-focus"
              />
            </div>

            <div style={{ marginBottom: '35px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ color: role === 'client' ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.9rem', fontWeight: 700 }}>Contraseña</label>
                <Link href="/recuperar" style={{ fontSize: '0.85rem', color: role === 'client' ? '#D2F23A' : '#6A35FF', fontWeight: 700 }}>¿Olvidaste la clave?</Link>
              </div>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '18px 60px 18px 24px', borderRadius: '16px', border: '2px solid transparent', background: role === 'client' ? 'rgba(255,255,255,0.04)' : '#F9F9FB', color: role === 'client' ? 'white' : '#12141D', fontSize: '1.2rem', outline: 'none', transition: 'all 0.3s' }}
                className="input-focus"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '20px', top: '50px', color: role === 'client' ? 'rgba(255,255,255,0.3)' : '#999', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '20px', borderRadius: '18px',
              background: loading ? 'rgba(184, 155, 255, 0.2)' : (role === 'client' ? '#D2F23A' : '#12141D'),
              color: loading ? 'rgba(255,255,255,0.3)' : (role === 'client' ? '#0D0E15' : 'white'),
              fontSize: '1.1rem', fontWeight: 900, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s',
              boxShadow: role === 'client' && !loading ? '0 15px 30px rgba(210, 242, 58, 0.2)' : 'none'
            }}>
              {loading ? (
                'Autenticando...'
              ) : (
                <>Acceder al sistema <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {view === 'register' && (
          <form onSubmit={submitRegister}>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ color: role === 'client' ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'block' }}>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Tu nombre"
                  style={{ width: '100%', padding: '18px', borderRadius: '16px', border: '2px solid transparent', background: role === 'client' ? 'rgba(255,255,255,0.03)' : '#F9F9FB', color: role === 'client' ? 'white' : '#12141D', fontSize: '1rem', outline: 'none' }}
                />
              </div>
              {role === 'client' && (
                <div style={{ flex: 1 }}>
                  <label style={{ color: role === 'client' ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'block' }}>Empresa</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} required
                    placeholder="Marca"
                    style={{ width: '100%', padding: '18px', borderRadius: '16px', border: '2px solid transparent', background: role === 'client' ? 'rgba(255,255,255,0.03)' : '#F9F9FB', color: role === 'client' ? 'white' : '#12141D', fontSize: '1rem', outline: 'none' }}
                  />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: role === 'client' ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'block' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="ejemplo@email.com"
                style={{ width: '100%', padding: '18px', borderRadius: '16px', border: '2px solid transparent', background: role === 'client' ? 'rgba(255,255,255,0.03)' : '#F9F9FB', color: role === 'client' ? 'white' : '#12141D', fontSize: '1rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <label style={{ color: role === 'client' ? 'rgba(255,255,255,0.5)' : '#666', fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'block' }}>Contraseña</label>
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••••••"
                style={{ width: '100%', padding: '18px 60px 18px 18px', borderRadius: '16px', border: '2px solid transparent', background: role === 'client' ? 'rgba(255,255,255,0.03)' : '#F9F9FB', color: role === 'client' ? 'white' : '#12141D', fontSize: '1.2rem', outline: 'none' }}
              />
            </div>

            {role === 'admin' ? (
              <div style={{ marginBottom: '35px' }}>
                <label style={{ color: '#ff6b6b', fontSize: '0.85rem', fontWeight: 800, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>Código de Agencia</label>
                <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)} required
                  placeholder="NEXA-CODE-XXXX"
                  style={{ width: '100%', padding: '18px', borderRadius: '16px', border: '2px dashed rgba(255,107,107,0.3)', background: '#FFF7F7', color: '#12141D', fontSize: '1rem', outline: 'none', textAlign: 'center', fontWeight: 900, textTransform: 'uppercase' }}
                />
              </div>
            ) : <div style={{ marginBottom: '35px' }} />}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '20px', borderRadius: '18px',
              background: loading ? 'rgba(184, 155, 255, 0.2)' : (role === 'client' ? '#B89BFF' : '#12141D'),
              color: role === 'client' ? '#12141D' : 'white',
              fontSize: '1.1rem', fontWeight: 900, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
            }}>
              {loading ? 'Procesando...' : 'Completar Registro'}
            </button>
          </form>
        )}

      </div>
      
      {/* GLOBAL OVERRIDES */}
      <style dangerouslySetInnerHTML={{ __html: `
        .input-focus:focus { border-color: #B89BFF !important; background: rgba(255,255,255,0.08) !important; }
        ::-webkit-input-placeholder { color: rgba(150,150,150,0.5); }
      ` }} />
    </div>
  );
}
