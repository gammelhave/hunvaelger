"use client";

import { useEffect, useMemo, useState } from "react";

type Profile = {
  id: string;
  name: string;
  age?: number;
  bio?: string;
  active?: boolean;
  photos?: string[]; // <= nye billed-URL’er
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // hent seneste profiler
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profiles", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setProfiles(Array.isArray(data?.profiles) ? data.profiles : []);
    } catch (e: any) {
      setError(e?.message ?? "Kunne ikke hente profiler");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // håndter valg af max 3 billeder
  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    const next = [...files, ...list].slice(0, 3);
    setFiles(next);

    // previews
    const urls = next.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  }

  function removeFile(idx: number) {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    setPreviewUrls(next.map((f) => URL.createObjectURL(f)));
  }

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (age !== "" && (Number.isNaN(Number(age)) || Number(age) <= 0)) return false;
    if (files.length > 3) return false;
    return true;
  }, [name, age, files.length]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    setOkMsg(null);

    try {
      // 1) upload billeder (0–3) til Blob og få URLs
      let uploadedUrls: string[] = [];
      if (files.length > 0) {
        const fd = new FormData();
        files.forEach((f) => fd.append("files", f));
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        if (!up.ok) throw new Error(await up.text());
        const { urls } = await up.json();
        uploadedUrls = urls ?? [];
      }

      // 2) POST profilen til din eksisterende /api/profiles
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          age: age === "" ? undefined : Number(age),
          bio: bio.trim() || undefined,
          photos: uploadedUrls, // <= gem disse URLs
          active: true,
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      setOkMsg("Profil oprettet ✔");
      setName("");
      setAge("");
      setBio("");
      setFiles([]);
      setPreviewUrls([]);
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Kunne ikke oprette profil");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Slet profilen?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/profiles?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e: any) {
      setError(e?.message ?? "Kunne ikke slette profil");
    }
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Profiler</h1>

      {/* Opret ny profil */}
      <form
        onSubmit={handleCreate}
        className="mb-10 rounded-2xl border p-5 grid gap-4"
      >
        <h2 className="text-lg font-semibold">Opret ny profil</h2>

        {error ? (
          <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm">
            {error}
          </div>
        ) : null}
        {okMsg ? (
          <div className="rounded-lg border border-green-300 bg-green-50 p-3 text-sm">
            {okMsg}
          </div>
        ) : null}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Navn</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Navn"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Alder</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="fx 40"
              type="number"
              min={18}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Bio</label>
          <textarea
            className="w-full rounded-xl border px-3 py-2"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kort om dig…"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label className="block text-sm mb-1">Billeder (max 3)</label>
            <span className="text-xs text-gray-500">{files.length}/3</span>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            className="block"
          />
          {previewUrls.length > 0 ? (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-full h-32 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute -top-2 -right-2 rounded-full border bg-white px-2 py-1 text-xs shadow"
                    title="Fjern"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <p className="text-xs text-gray-500 mt-2">
            Anbefaling: JPG/PNG, &lt; 5 MB pr. fil.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            disabled={!canSubmit || submitting}
            className="rounded-xl bg-pink-500 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Opretter…" : "Opret profil"}
          </button>
          <button
            type="button"
            onClick={() => {
              setName("");
              setAge("");
              setBio("");
              setFiles([]);
              setPreviewUrls([]);
              setError(null);
              setOkMsg(null);
            }}
            className="rounded-xl border px-4 py-2"
          >
            Nulstil
          </button>
        </div>
      </form>

      {/* Liste over profiler */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Eksisterende profiler</h2>
        {loading ? (
          <div>Loader…</div>
        ) : profiles.length === 0 ? (
          <div className="rounded-xl border p-5 text-sm text-gray-600">
            Ingen profiler
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {profiles.map((p) => (
              <li key={p.id} className="rounded-2xl border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">
                      {p.name}
                      {p.age ? `, ${p.age}` : ""}
                    </div>
                    {p.bio ? (
                      <p className="mt-2 text-sm whitespace-pre-line">{p.bio}</p>
                    ) : null}
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    title="Slet"
                  >
                    Slet
                  </button>
                </div>

                {Array.isArray(p.photos) && p.photos.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {p.photos.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`photo-${i}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
