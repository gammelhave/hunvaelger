"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Msg = { type: "ok" | "error"; text: string };

export default function SignupPage() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<Msg | null>(null);

  function validate(): string | null {
    if (!email.trim()) return "Email er påkrævet.";
    if (!password) return "Adgangskode er påkrævet.";
    if (password.length < 8) return "Adgangskoden skal være mindst 8 tegn.";
    if (password !== confirm) return "Adgangskoderne matcher ikke.";
    if (age && Number.isNaN(Number(age))) return "Alder skal være et tal.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    const v = validate();
    if (v) {
      setMsg({ type: "error", text: v });
      return;
    }

    setBusy(true);
    try {
      // 1) Opret bruger
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || undefined,
          // send kun age hvis udfyldt
          age: age ? Number(age) : undefined,
          bio: bio.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Kunne ikke oprette bruger. Prøv igen."
        );
      }

      // 2) Log ind
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (login?.error) throw new Error("Konto oprettet, men login fejlede.");

      setMsg({ type: "ok", text: "Konto oprettet – logger ind…" });

      // 3) Videre til admin eller forsiden
      router.replace("/admin");
    } catch (err: any) {
      setMsg({ type: "error", text: err?.message || "Der opstod en fejl." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Opret konto & profil</h1>

      {msg && (
        <div
          className={`mb-4 text-sm border p-2 rounded ${
            msg.type === "error"
              ? "text-red-700 border-red-200 bg-red-50"
              : "text-green-700 border-green-200 bg-green-50"
          }`}
        >
          {msg.text}
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
        />

        <div className="pt-2"></div>

        {/* Profil – valgfri (kan stå tomt for admin) */}
        <input
          className="w-full border rounded p-2"
          type="text"
          placeholder="Navn (valgfri)"
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
          min={0}
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
