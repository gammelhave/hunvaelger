'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const search = useSearchParams(); // OK i client component
  const msg = search.get('msg');    // fx ?msg=loggedout

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="mx-auto max-w-md p-6">
      {msg && (
        <div className="mb-3 rounded bg-pink-50 px-3 py-2 text-sm text-pink-700">
          {msg}
        </div>
      )}
      <h1 className="mb-4 text-2xl font-semibold">Admin login</h1>
      <form method="post" action="/api/admin/login">
        <label className="block text-sm mb-1">Email</label>
        <input
          className="w-full rounded border px-3 py-2 mb-3"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm mb-1">Adgangskode</label>
        <input
          className="w-full rounded border px-3 py-2 mb-4"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-pink-600 px-4 py-2 text-white hover:bg-pink-700"
        >
          Log ind
        </button>
      </form>
    </div>
  );
}
