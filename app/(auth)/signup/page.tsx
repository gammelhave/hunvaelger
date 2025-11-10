"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!email || !password) {
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

    // Rens alder til kun cifre og konverter til tal
    const ageClean = (age ?? "").toString().trim().replace(/[^\d]/g, "");
    const ageNum = ageClean ? Number(ageClean) : NaN;
    if (Number.isNaN(ageNum)) {
      setMsg("Alder skal være et tal (18–99).");
      return;
    }

    setBusy(true);
    try {
      // 1) Opret konto + profil (sender ALLE felter til /api/signup)
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || email.split("@")[0],
          age: ageNum,
          bio: bio || "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        // Backend-fejl – vis læsbar besked
        if (data?.error === "EMAIL_EXISTS") {
          throw new Error("E-mail er allerede registreret.");
        }
        if (data?.error === "VALIDATION") {
          const msg =
            data?.issues?.map((i: any) => i?.message || JSON.stringify(i)).join(" · ") ||
            "Ugyldigt input.";
          throw new Error(msg);
        }
        throw new Error(data?.message || "Kunne ikke oprette konto.");
      }

      // 2) Log ind
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!login || login.error) {
        throw new Error("Konto oprettet, men login fejlede.");
      }

      // 3) Videre til /admin eller /p
      router.replace("/admin"); // eller "/p" hvis det er det du vil
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

        <div className="pt-2"></div>

        {/* Profil */}
        <input
          className="w-full border rounded p-2"
          type="text"
          placeholder="Navn (visningsnavn)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
          required
        />
        <input
          className="w-full border rounded p-2"
          type="text"
          inputMode="numeric"
          placeholder="Alder (18–99)"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          disabled={busy}
          required
        />
        <textarea
          className="w-full border rounded p-2 min-h-[120px]"
          placeholder="Kort om dig"
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
