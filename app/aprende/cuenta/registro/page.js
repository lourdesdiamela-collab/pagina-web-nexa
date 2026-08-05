'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/aprende/mis-recursos';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'No pudimos crear tu cuenta.');
        setLoading(false);
        return;
      }
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });
      setLoading(false);
      if (signInRes?.error) {
        router.push('/aprende/cuenta/login');
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError('No pudimos crear tu cuenta. Intentá de nuevo.');
      setLoading(false);
    }
  }

  return (
    <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="aprende-auth-card">
          <h1>Creá tu cuenta</h1>
          <p>La necesitás para comprar recursos y acceder a tus descargas cuando quieras.</p>
          <form className="aprende-form" onSubmit={handleSubmit}>
            {error && <div className="aprende-form-error">{error}</div>}
            <div className="aprende-field">
              <label htmlFor="name">Nombre</label>
              <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="aprende-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="aprende-field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
              <UserPlus size={16} /> {loading ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>
          </form>
          <div className="aprende-auth-switch">
            ¿Ya tenés cuenta? <Link href="/aprende/cuenta/login">Ingresá</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
      <Footer />
    </>
  );
}
