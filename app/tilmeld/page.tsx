'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TilmeldPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');
    const name = String(fd.get('name') || '').trim();
    const bio = String(fd.get('bio') || '').trim();
    const ageStr = String(fd.get('age') || '').trim().replace(/[^\d]/g, '');
    const age = ageStr ? Number(ageStr) : NaN;

    if (!email || !password || !name || Number.isNaN(age)) {
      setError('Udfyld venligst alle felter (alder skal være et tal).');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, age, bio }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data?.error === 'EMAIL_EXISTS') setError('E-mail er allerede registreret.');
      else if (data?.error === 'VALIDATION') {
        const msg =
          data.issues?.map((i: any) => i.message || JSON.stringify(i)).join(' · ') ||
          'Ugyldigt input.';
        setError(msg);
      } else setError(data?.message || 'Kunne ikke oprette bruger.');
      setLoading(false);
      return;
    }

    router.push('/login'); // eller '/p'
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Opret konto & profil</h1>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" placeholder="E-mail" className="w-full rounded border px-3 py-2" required />
        <input name="password" type="password" placeholder="Adgangskode" className="w-full rounded border px-3 py-2" required minLength={6} />
        <input name="name" type="text" placeholder="Navn" className="w-full rounded border px-3 py-2" required />
        <input name="age" type="text" inputMode="numeric" placeholder="Alder" className="w-full rounded border px-3 py-2" required />
        <textarea name="bio" placeholder="Om dig" className="w-full rounded border px-3 py-2 min-h-[120px]" />
        <button type="submit" disabled={loading} className="w-full rounded bg-pink-600 px-4 py-2 font-semibold text-white disabled:opacity-60">
          {loading ? 'Gemmer…' : 'Gem profil'}
        </button>
      </form>
    </div>
  );
}
