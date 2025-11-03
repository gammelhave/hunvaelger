"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"woman"|"man">("woman");
  const [msg, setMsg] = useState<string|null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const r = await fetch("/api/signup", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const j = await r.json();
    if (!r.ok || j.ok === false) setMsg(j.error || "Kunne ikke oprette.");
    else setMsg("Bruger oprettet. Du kan nu logge ind.");
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Opret bruger</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Adgangskode" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={role==="woman"} onChange={()=>setRole("woman")} /> Kvinde (kan oprette/redigere profil)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={role==="man"} onChange={()=>setRole("man")} /> Mand (kan kun se via QR)
          </label>
        </div>
        <button className="px-4 py-2 bg-pink-600 text-white rounded">Opret</button>
      </form>
      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
