'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const response = await fetch(`/api/auth/${mode === 'login' ? 'login' : 'register'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return setError(data.error || 'Something went wrong.');
    router.push(data.user?.role === 'ADMIN' ? '/admin' : '/account');
    router.refresh();
  }

  return (
    <main className="auth-page shell">
      <section className="auth-card">
        <div>
          <span className="eyebrow" style={{ color: 'var(--green-700)' }}>Secure customer access</span>
          <h1>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1>
          <p className="section-sub">Save addresses, review previous orders and keep your shopping experience connected across visits.</p>
        </div>
        <form className="form-grid" onSubmit={submit}>
          {mode === 'register' && <label>Full name<input name="name" required minLength={2} autoComplete="name" /></label>}
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Password<input name="password" type="password" required minLength={mode === 'register' ? 8 : 1} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} /></label>
          {error && <p className="form-error">{error}</p>}
          <button className="pill primary" disabled={loading}>{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="text-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
          {mode === 'login' ? 'New customer? Create an account' : 'Already registered? Sign in'}
        </button>
      </section>
    </main>
  );
}
