'use client';

export const dynamic = 'force-dynamic';      // <- forhindrer prerender/SSG
export const fetchCache = 'force-no-store';  // <- ingen caching i edge/build

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AdminLoginPage() {
  const { status } = useSession(); // 'loading' | 'authenticated' | 'unauthenticated'
  const router = useRouter();
  const sp = useSearchParams();
  const nextUrl = useMemo(() => sp.get('next') || '/admin', [sp]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(sp.get('err'));

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/admin/_am_i_admin', { credentials: 'include' });
        if (!cancelled) {
          if (res.ok) {
            router.replace(nextUrl);
          } else {
            setErr('Din konto har ikke admin-rettigheder.');
            await signOut({ redirect: false });
          }
        }
      } catch {
        if (!cancelled) setErr('Kunne ikke verificere admin-rettigheder.');
      }
    })();

    return () => { cancelled = true; };
  }, [status, nextUrl, router]);

  if (status === 'authenticated') {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="animate-pulse mb-2">Tjekker admin-adgang…</div>
        </div>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (res?.error) setErr('Forkert email eller adgangskode.');
  };

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl shadow p-6 bg-white">
        <h1 className="text-xl font-semibold mb-4">Admin login</h1>

        {err && (
          <div className="mb-4 rounded bg-red-50 text-red-700 p-3 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Adgangskode</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded px-4 py-2"
          >
            Log ind
          </button>
        </form>
      </div>
    </div>
  );
}
