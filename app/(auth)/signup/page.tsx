"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>(""); // <- valgfri (tom streng betyder “ikke angivet”)
  const [bio, setBio] = useState("");

  // ui state
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    // simple clientvalidering
    if (!email.trim() || !password) {
      setMsg("Email og adgangskode er påkrævet.");
      return;
    }
    if (password !== confirm) {
      setMsg("Adgangskoderne matcher ikke.");
      return;
    }
    if (password.length < 8) {
      setMsg("Adgangskoden skal være mindst 8 tegn.");
      return;
    }

    setBusy(true);
    try {
      // 1) Opret konto
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || undefined, // backend må gerne få undefined
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.message || data?.error || "Kunne ikke oprette bruger.");
      }

      // 2) Automatisk login
      const login = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (!login || login.error) {
        throw new Error("Konto oprettet, men login fejlede.");
      }

      // 3) Opret profil (valgfri felter sendes kun hvis udfyldt)
      const payload: {
        name?: string;
        age?: number;
        bio?: string;
      } = {};
      if (name.trim()) payload.name = name.trim();
      if (age.trim()) {
        const n = Number(age);
        if (!Number.isNaN(n)) payload.age = n;
      }
      if (bio.trim()) payload.bio = bio.trim();

      if (Object.keys(payload).length > 0) {
        // må gerne fejle stille; profilen kan altid redigeres efterfølgende
        await fetch("/api/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => {});
      }

      // 4) Videre til admin
      router.replace("/admin");
    } catch (err: any) {
      setMsg(err?.message || "Der opstod en fejl.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Opret konto & profil</h1>

      {msg && (
        <div className="mb-4 text-sm text-red-700 border border-red-200 bg-red-50 p-2 rounded">
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        {/* Konto */}
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email (påkrævet)"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={busy}
          required
        />

        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Adgangskode (min. 8 tegn)"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={busy}
          required
          minLength={8}
        />

        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Gentag adgangskode"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={busy}
          required
          minLength={8}
        />

        <div className="pt-2" />

        {/* Profil (valgfri felter – alder er IKKE required) */}
        <input
          className="w-full border rounded p-2"
          type="text"
          placeholder="Navn (visningsnavn – valgfri)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
        />

        <input
          className="w-full border rounded p-2"
          type="number"
          placeholder="Alder (valgfri)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          disabled={busy}
          min={18}
          max={120}
        />

        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          placeholder="Kort om dig (valgfri)"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={busy}
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-pink-600 text-white rounded disabled:opacity-50"
          disabled={busy}
        >
          {busy ? "Opretter..." : "Gem profil"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-3">
        Har du allerede en bruger?{" "}
        <a className="underline" href="/login">
          Log ind
        </a>
        .
      </p>
    </div>
  );
}
