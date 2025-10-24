"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    age: "",
    city: "",
    photo: "",
    bio: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profiles", { cache: "no-store" });
      const json = await res.json();
      setList(json.data || []);
    } catch (e) {
      setError("Kunne ikke hente profiler");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
  }

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

  async function onDelete(id) {
    if (!confirm(`Slet profil ${id}?`)) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/profiles?id=${id}`, { method: "DELETE" });
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
        id: form.id.trim(),
        name: form.name.trim(),
        age: Number(form.age),
        city: form.city.trim(),
        photo: form.photo.trim(),
        bio: form.bio.trim(),
        interests: form.interests,
      };

      const isEdit = Boolean(editingId);
      const url = isEdit ? `/api/profiles?id=${editingId}` : "/api/profiles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Fejl ved gem");

      await load();
      clearForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin</h1>
        <nav className="flex gap-3 text-sm">
          <a className="underline opacity-80" href="/">Forside</a>
          <a className="underline opacity-80" href="/p">Profiler</a>
        </nav>
      </header>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}

      <section className="rounded-2xl border bg-white/60 p-5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{editingId ? "Redigér profil" : "Ny profil"}</h2>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm opacity-70">ID *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="unik id, f.eks. a3"
              disabled={!!editingId}
              required
            />
          </div>
          <div>
            <label className="text-sm opacity-70">Navn *</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Bio</label>
            <textarea
              className="mt-1 w-full rounded-lg border px-3 py-2"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm opacity-70">Interesser (komma-separeret)</label>
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
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={`/p/${p.id}`}
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
        Bemærk: Admin ændringer gemmes i serverens hukommelse og nulstilles ved kold start/deploy. Vi
        kobler rigtig database på i næste trin.
      </p>
    </main>
  );
}
