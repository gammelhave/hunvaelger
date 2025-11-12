"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const next = useSearchParams().get("next") || "/admin";
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const res = await signIn("credentials", {
      email,
      password: pwd,
      admin: "1", // ← vigtigt: admin-login
      redirect: false,
    });

    if (res?.ok) router.push(next);
    else setErr("Forkert login eller mangler admin-rettigheder");
  }

  return (
    <div className="max-w-sm mx-auto py-16">
      <h1 className="text-2xl font-semibold mb-4">Admin login</h1>
      {err && <p className="text-red-600 mb-3">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Admin email"
          className="w-full border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Adgangskode"
          className="w-full border rounded p-2"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <button className="px-4 py-2 rounded bg-pink-600 text-white">
          Log ind
        </button>
      </form>
    </div>
  );
}
