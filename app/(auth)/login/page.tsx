"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const qp = useSearchParams();
  const urlErr = qp.get("error"); // fx CredentialsSignin

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false
      });

      if (!res) {
        setMsg("Uventet svar fra serveren.");
        return;
      }

      if (res.error) {
        // NextAuth returnerer fx "CredentialsSignin" ved forkert login
        setMsg(res.error === "CredentialsSignin" ? "Forkert email eller adgangskode." : res.error);
        return;
      }

      // success
      router.replace("/admin"); // eller "/min-profil"
    } catch (err: any) {
      setMsg(err?.message || "Der opstod en fejl.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Log ind</h1>

      {(urlErr || msg) && (
        <div className="text-sm text-red-600 border border-red-200 bg-red-50 p-2 rounded">
          {msg || (urlErr === "CredentialsSignin" ? "Forkert email eller adgangskode." : urlErr)}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Adgangskode"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Logger ind…" : "Log ind"}
        </button>
      </form>

      <p className="text-sm text-gray-500">
        Har du ingen bruger? Opret via <a className="underline" href="/signup">/signup</a>.
      </p>
    </div>
  );
}
