'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/aprende/mis-recursos';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (res?.error) {
      setError('Email o contraseña incorrectos.');
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main style={{ paddingTop: 'clamp(88px, 10vw, 116px)', background: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingBottom: 80 }}>
        <div className="aprende-auth-card">
          <h1>Ingresá a tu cuenta</h1>
          <p>Accedé para ver tus compras y descargar tus recursos.</p>
          <form className="aprende-form" onSubmit={handleSubmit}>
            {error && <div className="aprende-form-error">{error}</div>}
            <div className="aprende-field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="aprende-field">
              <label htmlFor="password">Contraseña</label>
              <input id="password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
              <LogIn size={16} /> {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
          <div className="aprende-auth-switch">
            ¿No tenés cuenta? <Link href="/aprende/cuenta/registro">Creá una gratis</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <Footer />
    </>
  );
}
