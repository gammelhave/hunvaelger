"use client";

import React, { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("admin@hunvaelger.dk");
  const [password, setPassword] = useState("Telefon1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (!res) {
      setError("Noget gik galt. Prøv igen.");
      return;
    }

    if (res.error) {
      setError("Forkert email eller adgangskode.");
      return;
    }

    // Succes: send til /admin
    router.push("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin login</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Log ind med din admin-konto for at se og eksportere profiler.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Adgangskode
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 text-sm disabled:opacity-60"
          >
            {loading ? "Logger ind..." : "Log ind"}
          </button>
        </form>
      </div>
    </div>
  );
}
