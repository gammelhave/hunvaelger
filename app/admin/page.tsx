"use client";

import { useEffect, useMemo, useState } from "react";

/** ---------- Typer ---------- */
type Profile = {
  id?: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
};

/** ---------- Admin-side ---------- */
export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Opret-profil form state
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState<number | "">("");
  const [newBio, setNewBio] = useState("");
  const [newFiles, setNewFiles] = useState<FileList | null>(null);
  const newImagesCount = useMemo(() => (newFiles ? Math.min(newFiles.length, 3) : 0), [newFiles]);

  // Rediger-modal state
  const [editing, setEditing] = useState<Profile | null>(null);

  /** ------ Helpers ------ */
  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/profiles", { cache: "no-store" });
      const j = await r.json();
      if (!r.ok || !j?.ok) throw new Error(j?.error || "Kunne ikke hente profiler");
      setProfiles(j.profiles as Profile[]);
    } catch (e: any) {
      setErr(e.message || "Ukendt fejl");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadOne(f: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", f);

    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const ct = r.headers.get("content-type") || "";
    let payload: any = null;

    try {
      payload = ct.includes("application/json") ? await r.json() : await r.text();
    } catch {
      payload = await r.text().catch(() => "");
    }

    if (!r.ok) {
      const msg =
        (typeof payload === "string" && payload) || (payload?.error as string) || "Upload fejlede";
      throw new Error(msg);
    }

    const url = payload?.url || payload?.files?.[0]?.url;
    if (!url) throw new Error("Upload svarede uden URL");
    return url as string;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    try {
      // 1) Upload evt. billeder (max 3)
      const urls: string[] = [];
      if (newFiles && newFiles.length) {
        const toUpload = Array.from(newFiles).slice(0, 3);
        for (const f of toUpload) {
          if (f.size > 5 * 1024 * 1024) throw new Error("Hvert billede skal være under 5 MB");
          urls.push(await uploadOne(f));
        }
      }

      // 2) Opret profil
      const body = {
        name: newName.trim(),
        age: Number(newAge || 0),
        bio: newBio.trim(),
        images: urls,
      };
      const r = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const ct = r.headers.get("content-type") || "";
      const j = ct.includes("application/json") ? await r.json() : { ok: r.ok };

      if (!r.ok || !j?.ok) throw new Error(j?.error || "Kunne ikke oprette profil");

      // 3) Reset + reload
      setNewName("");
      setNewAge("");
      setNewBio("");
      setNewFiles(null);
      await load();
    } catch (e: any) {
      setErr(e.message || "Ukendt fejl ved oprettelse");
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    if (!confirm("Slet profilen?")) return;
    setErr(null);
    try {
      // Prøv RESTful route først
      let r = await fetch(`/api/profiles/${id}`, { method: "DELETE" });
      if (r.status === 404) {
        // Fallback til evt. ældre DELETE-implementering
        r = await fetch("/api/profiles", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      }
      const ct = r.headers.get("content-type") || "";
      const j = ct.includes("application/json") ? await r.json() : { ok: r.ok };
      if (!r.ok || j?.ok === false) throw new Error(j?.error || "Kunne ikke slette");
      await load();
    } catch (e: any) {
      setErr(e.message || "Fejl ved sletning");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin – Profiler</h1>

      {/* Opret ny profil */}
      <form onSubmit={handleCreate} className="bg-white/70 rounded-2xl border p-4 md:p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm text-gray-600">Navn</span>
            <input
              className="w-full border rounded-lg p-2"
              placeholder="Navn"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-gray-600">Alder</span>
            <input
              className="w-full border rounded-lg p-2"
              type="number"
              placeholder="fx 40"
              value={newAge}
              onChange={(e) => setNewAge(e.target.value === "" ? "" : Number(e.target.value))}
              required
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm text-gray-600">Bio</span>
          <textarea
            className="w-full border rounded-lg p-2 min-h-28"
            placeholder="Kort om dig…"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
          />
        </label>

        <div className="space-y-1">
          <label className="inline-flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setNewFiles(e.currentTarget.files)}
            />
            <span className="text-sm text-gray-600">Billeder (max 3)</span>
          </label>
          <div className="text-xs text-gray-500">Anbefaling: JPG/PNG, &lt; 5 MB pr. fil.</div>
          <div className="text-xs text-gray-500">{newImagesCount}/3 valgt</div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-pink-500 text-white">Opret profil</button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border"
            onClick={() => {
              setNewName("");
              setNewAge("");
              setNewBio("");
              setNewFiles(null);
            }}
          >
            Nulstil
          </button>
        </div>
      </form>

      {/* Eksisterende profiler */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Eksisterende profiler</h2>

        {loading ? (
          <div className="text-sm text-gray-600">Indlæser…</div>
        ) : profiles.length === 0 ? (
          <div className="text-sm text-gray-600">Ingen profiler endnu.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {profiles.map((p) => (
              <article key={(p.id || p.name + "_" + p.age)} className="border rounded-2xl p-4 space-y-2 bg-white/70">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold">
                    {p.name}, {p.age}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded border" onClick={() => setEditing(p)}>
                      Rediger
                    </button>
                    <button className="px-3 py-1 rounded border" onClick={() => handleDelete(p.id)}>
                      Slet
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.bio}</p>

                {p.images?.length ? (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {p.images.map((u) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={u} src={u} alt="" className="w-full h-24 object-cover rounded-lg border" />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Ingen billeder endnu.</p>
                )}
              </article>
            ))}
          </div>
        )}

        {err && <div className="text-sm text-red-600">{err}</div>}
      </section>

      {/* Rediger-modal */}
      {editing && (
        <EditProfileDialog
          profile={editing}
          onClose={() => setEditing(null)}
          onSaved={(upd) => {
            setProfiles((prev) => prev.map((x) => (x.id === upd.id ? upd : x)));
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

/** ---------- Rediger-dialog (modal) ---------- */
function EditProfileDialog({
  profile,
  onClose,
  onSaved,
}: {
  profile: Profile;
  onClose: () => void;
  onSaved: (p: Profile) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState<number | "">(profile.age || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [images, setImages] = useState<string[]>(profile.images ?? []);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function uploadOne(f: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", f);

    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const ct = r.headers.get("content-type") || "";
    let payload: any = null;

    try {
      payload = ct.includes("application/json") ? await r.json() : await r.text();
    } catch {
      payload = await r.text().catch(() => "");
    }

    if (!r.ok) {
      const msg =
        (typeof payload === "string" && payload) || (payload?.error as string) || "Upload fejlede";
      throw new Error(msg);
    }

    const url = payload?.url || payload?.files?.[0]?.url;
    if (!url) throw new Error("Upload svarede uden URL");
    return url as string;
  }

  async function handleAddFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const cap = 3 - images.length;
    if (cap <= 0) return setErr("Du har allerede 3 billeder.");
    setErr(null);
    setBusy(true);
    try {
      const toUpload = Array.from(files).slice(0, cap);
      const newUrls: string[] = [];
      for (const f of toUpload) {
        if (f.size > 5 * 1024 * 1024) throw new Error("Hvert billede skal være under 5 MB");
        newUrls.push(await uploadOne(f));
      }
      setImages((prev) => [...prev, ...newUrls]);
    } catch (e: any) {
      setErr(e.message || "Ukendt fejl ved upload");
    } finally {
      setBusy(false);
    }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const body = {
        name: name.trim(),
        age: Number(age || 0),
        bio: bio.trim(),
        images,
      };

      // VIGTIGT: brug eksisterende id – ellers lav et nyt stabilt id
      const targetId = profile.id || String(Date.now());

      const r = await fetch(`/api/profiles/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const ct = r.headers.get("content-type") || "";
      let payload: any = null;
      try {
        payload = ct.includes("application/json") ? await r.json() : await r.text();
      } catch {
        payload = await r.text().catch(() => "");
      }

      if (!r.ok) {
        const msg =
          (typeof payload === "string" && payload) ||
          (payload?.error as string) ||
          "Kunne ikke gemme";
        throw new Error(msg);
      }

      const updated = (typeof payload === "string" ? null : payload?.profile) as Profile | null;
      if (!updated) throw new Error("Serveren returnerede ingen profil");
      onSaved(updated);
    } catch (e: any) {
      setErr(e.message || "Ukendt fejl");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Rediger profil</h2>
          <button className="px-3 py-1 rounded border" onClick={onClose} disabled={busy}>
            Luk
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-2">
            <span className="text-sm text-gray-600">Navn</span>
            <input className="w-full border rounded-lg p-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="space-y-2">
            <span className="text-sm text-gray-600">Alder</span>
            <input
              className="w-full border rounded-lg p-2"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>
        </div>

        <label className="space-y-2 block">
          <span className="text-sm text-gray-600">Bio</span>
          <textarea className="w-full border rounded-lg p-2 min-h-28" value={bio} onChange={(e) => setBio(e.target.value)} />
        </label>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Billeder (max 3)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleAddFiles(e.currentTarget.files)}
              disabled={busy || images.length >= 3}
            />
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {images.map((url) => (
                <div key={url} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-28 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 bg-white/90 border rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    Fjern
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500">Anbefaling: JPG/PNG, &lt; 5 MB pr. fil.</p>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose} disabled={busy}>
            Annullér
          </button>
          <button className="px-4 py-2 rounded-lg bg-pink-500 text-white disabled:opacity-50" onClick={save} disabled={busy}>
            Gem
          </button>
        </div>
      </div>
    </div>
  );
}
