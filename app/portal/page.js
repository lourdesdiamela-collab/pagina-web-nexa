'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Building2, Eye, EyeOff, UserRound, UsersRound } from 'lucide-react';
import { NexaLogo } from '@/components/NexaLogo';

export default function PortalPage() {
  const router = useRouter();

  const [view, setView] = useState('login');
  const [role, setRole] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    inviteCode: '',
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const login = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No pudimos iniciar sesion');
      router.push(payload.redirect);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const register = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          password: form.password,
          role,
          inviteCode: form.inviteCode,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'No pudimos crear la cuenta');

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginPayload = await loginResponse.json();
      if (!loginResponse.ok) throw new Error(loginPayload.error || 'Cuenta creada, pero no se pudo iniciar sesion');

      router.push(loginPayload.redirect);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(184,155,255,0.26), rgba(13,14,21,1) 42%)', color: 'white', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div style={{ width: 'min(1120px, 100%)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(12,13,22,0.75)', backdropFilter: 'blur(16px)', display: 'grid', gridTemplateColumns: '1.2fr 1fr', overflow: 'hidden' }}>
        <section style={{ padding: '52px 46px', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(135deg, rgba(210,242,58,0.08), transparent 45%)' }} />
          <div style={{ position: 'relative' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', marginBottom: 26 }}>
              <NexaLogo size={42} color="white" />
            </Link>
            <p style={{ margin: 0, fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.56)' }}>
              Plataforma operativa
            </p>
            <h1 style={{ margin: '10px 0 14px', fontSize: 'clamp(1.9rem, 3vw, 2.8rem)', lineHeight: 1.08 }}>
              {role === 'client' ? 'Tu espacio de trabajo con NEXA' : 'Control operativo del Equipo NEXA'}
            </h1>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', maxWidth: 520 }}>
              Todo en un mismo lugar: clientes, tareas, seguimiento, pagos, reportes e integraciones reales.
            </p>

            <div style={{ marginTop: 26, display: 'grid', gap: 10 }}>
              {['Seguimiento en tiempo real', 'Gestor de tareas conectado a Trello', 'Notificaciones centralizadas por correo'].map((item) => (
                <div key={item} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', padding: '10px 12px', color: 'rgba(255,255,255,0.84)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: 28, borderLeft: '1px solid rgba(255,255,255,0.1)', background: 'rgba(8,9,16,0.6)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button type="button" onClick={() => { setView('login'); setError(''); }} style={view === 'login' ? activeSwitch : inactiveSwitch}>Ingresar</button>
            <button type="button" onClick={() => { setView('register'); setError(''); }} style={view === 'register' ? activeSwitch : inactiveSwitch}>Crear cuenta</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <button type="button" onClick={() => setRole('client')} style={role === 'client' ? activeRole : inactiveRole}>
              <Building2 size={16} /> Cliente
            </button>
            <button type="button" onClick={() => setRole('admin')} style={role === 'admin' ? activeRole : inactiveRole}>
              <UsersRound size={16} /> Equipo NEXA
            </button>
          </div>

          {error && (
            <div style={{ marginBottom: 12, borderRadius: 12, border: '1px solid rgba(255,107,107,0.45)', background: 'rgba(255,107,107,0.12)', color: '#ffd8d8', padding: '10px 12px' }}>
              {error}
            </div>
          )}

          {view === 'login' ? (
            <form onSubmit={login} style={{ display: 'grid', gap: 10 }}>
              <input type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Email" style={inputStyle} />
              <label style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="Password" style={{ ...inputStyle, paddingRight: 38 }} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} style={eyeButtonStyle}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
              <button type="submit" disabled={loading} style={submitStyle}>
                {loading ? 'Ingresando...' : <>Ingresar <ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={register} style={{ display: 'grid', gap: 10 }}>
              <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Nombre y apellido" style={inputStyle} />
              {role === 'client' && (
                <input required value={form.company} onChange={(event) => updateField('company', event.target.value)} placeholder="Empresa" style={inputStyle} />
              )}
              <input type="email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="Email" style={inputStyle} />
              <label style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(event) => updateField('password', event.target.value)} placeholder="Password" style={{ ...inputStyle, paddingRight: 38 }} />
                <button type="button" onClick={() => setShowPassword((value) => !value)} style={eyeButtonStyle}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
              {role === 'admin' && (
                <input value={form.inviteCode} onChange={(event) => updateField('inviteCode', event.target.value)} placeholder="Codigo de acceso del equipo" style={inputStyle} />
              )}
              <button type="submit" disabled={loading} style={submitStyle}>
                {loading ? 'Creando cuenta...' : <>Crear cuenta <UserRound size={16} /></>}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'rgba(255,255,255,0.04)',
  color: 'white',
  padding: '10px 12px',
};

const submitStyle = {
  borderRadius: 12,
  border: '1px solid rgba(210,242,58,0.38)',
  background: 'rgba(210,242,58,0.16)',
  color: '#f3ffb5',
  padding: '10px 12px',
  fontWeight: 700,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
};

const activeSwitch = {
  flex: 1,
  borderRadius: 10,
  border: '1px solid rgba(184,155,255,0.5)',
  background: 'rgba(184,155,255,0.2)',
  color: 'white',
  padding: '8px 10px',
  fontWeight: 700,
};

const inactiveSwitch = {
  flex: 1,
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.03)',
  color: 'rgba(255,255,255,0.78)',
  padding: '8px 10px',
  fontWeight: 600,
};

const activeRole = {
  borderRadius: 10,
  border: '1px solid rgba(210,242,58,0.45)',
  background: 'rgba(210,242,58,0.15)',
  color: '#f3ffb5',
  padding: '8px 10px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  fontWeight: 700,
};

const inactiveRole = {
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.15)',
  background: 'rgba(255,255,255,0.03)',
  color: 'rgba(255,255,255,0.78)',
  padding: '8px 10px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  fontWeight: 600,
};

const eyeButtonStyle = {
  position: 'absolute',
  right: 10,
  top: 9,
  borderRadius: 8,
  border: 'none',
  background: 'transparent',
  color: 'rgba(255,255,255,0.6)',
  padding: 4,
};
