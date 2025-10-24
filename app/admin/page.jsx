"use client";

import { useEffect, useMemo, useState } from "react";

/* ===== Admin key helpers (gemmes i browseren) ===== */
const ADMIN_KEY_STORAGE = "hv_admin_key";
function getAdminKey() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_KEY_STORAGE) || "";
}
function setAdminKey(v) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_KEY_STORAGE, v);
}

/* ===== Små utils ===== */
function normalizeId(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function AdminPage() {
  /* state */
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [adminKey, setAdminKeyState] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    age: "",
    city: "",
    photo: "",
    bio: "",
    interests: "",
  });

  /* load admin key on mount */
  useEffect(() => {
    setAdminKeyState(getAdminKey());
  }, []);

  function saveKey() {
    setAdminKey(adminKey);
    alert("Admin-nøgle gemt i denne browser.");
  }

  /* data load */
  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profiles", { cache: "no-store" });
      const json = await res.json();
      setList(json.data || []);
    } catch (e) {
      setError("Kunne ikke hente profiler.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  /* form helpers */
  function clearForm() {
    setEditingId(null);
    setForm({
      id: "",
      name: "",
      age: "",
      city: "",
      photo: "",
      bio: "",
      interests: "",
    });
  }

  function onEdit(p) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name || "",
      age: String(p.age ?? ""),
      city: p.city || "",
      photo: p.photo || "",
      bio: p.bio || "",
      interests: (p.interests || []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(id) {
    if (!confirm(`Slet profil ${id}?`)) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/profiles?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey || getAdminKey() },
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Fejl ved sletning");
      await load();
      if (editingId === id) clearForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        id: normalizeId(form.id || form.name),
        name: form.name.trim(),
        age: Number(form.age),
        city: form.city.trim(),
        photo: form.photo.trim(),
        bio: form.bio.trim(),
        interests: form.interests, // API splitter selv på komma
      };

      if (!payload.id || !payload.name || !payload.age || !payload.city) {
        throw new Error("Udfyld venligst ID/Name/Age/City");
      }

      const isEdit = Boolean(editingId);
      const url = isEdit
        ? `/api/profiles?id=${encodeURIComponent(editingId)}`
        : "/api/profiles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey || getAdminKey(),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Fejl ved gem");

      await load();
      clearForm();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const sorted = useMemo(
    () => [...list].sort((a, b) => a.name.localeCompare(b.name)),
    [list]
  );

  /* ===== Render ===== */
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin</h1>
        <nav className="flex gap-3 text-sm">
          <a className="underline opacity-80" href="/">
            Forside
          </a>
          <a className="underline opacity-80" href="/p">
            Profiler
          </a>
        </nav>
      </header>

      {/* Admin nøgle */}
      <section className="rounded-2xl border bg-white/60 p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm opacity-70">Admin-nøgle</label>
            <input
              type="password"
              className="mt-1 w-64 rounded-lg border px-3 py-2"
              value={adminKey}
              onChange={(e) => setAdminKeyState(e.target.value)}
              placeholder="Indsæt nøgle fra Vercel ENV"
            />
          </div>
          <button onClick={saveKey} className="rounded-xl border px-4 py-2">
            Gem nøgle
          </button>
          <button
            onClick={() => {
              setAdminKeyState("");
              setAdminKey("");
            }}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Ryd nøgle
          </button>
        </div>
        <p className="mt-2 text-xs opacity-60">
          Nøglen sendes som header <code>x-admin-key</code> til API’et for
          ændringer (POST/PUT/DELETE).
        </p>
      </section>

      {/* Fejlbesked */}
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      {/* Form */}
      <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId ? "Redigér profil" : "Ny profil"}
        </h2>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm opacity-70">ID *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.id}
              onChange={(e) =>
                setForm({ ...form, id: normalizeId(e.target.value) })
              }
              placeholder="unik id, fx c3"
              disabled={!!editingId}
              required
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Navn *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                  id: form.id || normalizeId(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Alder *</label>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm opacity-70">By *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Foto (URL)</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
              placeholder="/avatars/anna.jpg eller https://..."
            />
            {form.photo && (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.photo}
                  alt="preview"
                  className="h-20 w-20 rounded-lg object-cover border"
                />
                <span className="text-xs opacity-70">{form.photo}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Bio</label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Kort tekst om personen"
            />
            {form.bio.startsWith("/") && (
              <p className="mt-1 text-xs text-red-600">
                Det ligner en billedsti i bio. Flyt den op i “Foto (URL)”.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">
              Interesser (komma-separeret)
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.interests}
              onChange={(e) => setForm({ ...form, interests: e.target.value })}
              placeholder="heste, musik, outdoor"
            />
          </div>

          <div className="flex gap-3 md:col-span-2">
            <button
              disabled={saving}
              className="rounded-xl bg-black px-5 py-2 text-white shadow-sm disabled:opacity-60"
              type="submit"
            >
              {editingId ? "Gem ændringer" : "Tilføj profil"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="rounded-xl border px-5 py-2"
            >
              Nulstil
            </button>
          </div>
        </form>
      </section>

      {/* Liste */}
      <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Profiler ({sorted.length})</h2>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Opdatér
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((p) => (
            <div key={p.id} className="rounded-2xl border p-4">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.photo || "/avatars/placeholder.jpg"}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm opacity-70">
                  {p.age} • {p.city}
                </div>
                <div className="mt-1 text-xs opacity-60">ID: {p.id}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={`/p/${encodeURIComponent(p.id)}`}
                  className="rounded-xl border px-3 py-1 text-sm"
                >
                  Vis
                </a>
                <button
                  className="rounded-xl border px-3 py-1 text-sm"
                  onClick={() => onEdit(p)}
                >
                  Redigér
                </button>
                <button
                  className="rounded-xl border px-3 py-1 text-sm text-red-600"
                  onClick={() => onDelete(p.id)}
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs opacity-60">
        Tip: Ved nye deploys forbliver data nu i MongoDB. Husk at sætte ENV{" "}
        <code>ADMIN_KEY</code> i Vercel og indtaste den her i admin for at kunne
        skrive ændringer.
      </p>
    </main>
  );
}
