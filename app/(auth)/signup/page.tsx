"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const r = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password })
      });
      const j = await r.json();
      if (!r.ok || j?.ok === false) {
        throw new Error(j?.error || "Kunne ikke oprette bruger");
      }
      setMsg("Bruger oprettet ✅ Du kan nu logge ind.");
      setTimeout(() => router.push("/login"), 800);
    } catch (err: any) {
      setMsg(err?.message || "Fejl ved oprettelse");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Opret kvinde-bruger</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Navn (vises i profil-admin)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email (login)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Adgangskode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Opretter…" : "Opret bruger"}
        </button>
      </form>
      {msg && <div className="text-sm">{msg}</div>}
      <p className="text-sm text-gray-500">
        Bemærk: Kun kvinder kan oprette/redigere profiler. Mænd kan kun se profiler via QR-link.
      </p>
    </div>
  );
}
