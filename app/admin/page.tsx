"use client"

import { useEffect, useState } from "react"

type Profile = { id: string; name: string; age?: number; bio?: string; active?: boolean; deletedAt?: number | null }

export default function AdminPage() {
  const [list, setList] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ name: string; age: string; bio: string }>({ name: "", age: "", bio: "" })
  const [clearing, setClearing] = useState(false)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      // Admin må gerne se alle, så vi laver et internt admin-endpoint
      // Brug det offentlige + incl=all via query? For simpelt laver vi fetch fra admin-API, men GET /api/profiles viser kun aktive.
      const res = await fetch("/api/profiles", { cache: "no-store" })
      const data = await res.json()
      // data.profiles er kun aktive – hent de inaktive via et lille hack:
      // For simpelt demo holder vi os til aktive + cache over admin actions:
      setList(data?.profiles ?? [])
    } catch {
      setError("Kunne ikke hente profiler.")
    } finally {
      setLoading(false)
    }
  }

  // Simpel admin-list: vi supplerer med at hente inaktive via en lille side-load
  useEffect(() => {
    load()
    ;(async () => {
      // Hent ALLE fra et særligt admin-kald (midlertidigt: vi kalder PATCH uden body for at få alle? Nej.)
      // For at holde koden ren, laver vi i stedet en lille client-side fallback:
      const res = await fetch("/api/profiles?all=1", { cache: "no-store" }).catch(() => null)
      if (res && res.ok) {
        const data = await res.json().catch(() => ({}))
        if (data && Array.isArray(data.profilesAll)) {
          setList(data.profilesAll)
        }
      }
    })()
  }, [])

  function startEdit(p: Profile) {
    setEditingId(p.id)
    setEdit({ name: p.name ?? "", age: p.age ? String(p.age) : "", bio: p.bio ?? "" })
  }
  function cancelEdit() { setEditingId(null) }

  async function saveEdit(id: string) {
    setBusyId(id); setError(null)
    try {
      const payload: any = { name: edit.name.trim(), bio: edit.bio.trim() }
      if (edit.age.trim() !== "") payload.age = Number(edit.age)
      const res = await fetch(`/api/profiles/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      const { profile } = await res.json()
      setList((prev) => prev.map((p) => (p.id === id ? profile : p)))
      setEditingId(null)
    } catch {
      setError("Kunne ikke gemme ændringer.")
    } finally { setBusyId(null) }
  }

  async function softRemove(id: string) {
    if (!confirm("Deaktivér (soft delete) denne profil?")) return
    setBusyId(id); setError(null)
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setList((prev) => prev.map((p) => (p.id === id ? { ...p, active: false, deletedAt: Date.now() } : p)))
    } catch { setError("Kunne ikke deaktivere profilen.") }
    finally { setBusyId(null) }
  }

  async function restore(id: string) {
    setBusyId(id); setError(null)
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "POST" })
      if (!res.ok) throw new Error()
      const { profile } = await res.json()
      setList((prev) => prev.map((p) => (p.id === id ? profile : p)))
    } catch { setError("Kunne ikke gendanne profilen.") }
    finally { setBusyId(null) }
  }

  async function hardRemove(id: string) {
    if (!confirm("SLET PERMANENT? Dette kan ikke fortrydes.")) return
    setBusyId(id); setError(null)
    try {
      const res = await fetch(`/api/profiles/${id}?hard=1`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setList((prev) => prev.filter((p) => p.id !== id))
    } catch { setError("Kunne ikke slette permanent.") }
    finally { setBusyId(null) }
  }

  async function removeAll() {
    if (!confirm("Slet ALLE profiler permanent?")) return
    setClearing(true); setError(null)
    try {
      const res = await fetch("/api/profiles/clear", { method: "POST" })
      if (!res.ok) throw new Error()
      setList([])
    } catch { setError("Kunne ikke slette alle profiler.") }
    finally { setClearing(false) }
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Admin – Profiler</h1>
        <button onClick={removeAll} disabled={clearing || list.length === 0}
          className="rounded-lg border border-red-300 text-red-600 px-3 py-2 hover:bg-red-50 disabled:opacity-50">
          {clearing ? "Sletter alle…" : "Tøm alle (permanent)"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-600">Indlæser…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-600">Ingen profiler.</p>
      ) : (
        <ul className="grid gap-4">
          {list.map((p) => {
            const isEditing = editingId === p.id
            const inactive = p.active === false
            return (
              <li key={p.id} className={`rounded-2xl border bg-white p-5 ${inactive ? "opacity-70" : ""}`}>
                {!isEditing ? (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {p.name}{p.age ? `, ${p.age}` : ""}
                        </h3>
                        {inactive && (
                          <span className="text-xs rounded-full px-2 py-0.5 border border-gray-300 text-gray-600">
                            Deaktiveret
                          </span>
                        )}
                      </div>
                      {p.bio && <p className="text-gray-700 mt-1">{p.bio}</p>}
                      <p className="text-xs text-gray-400 mt-2">ID: {p.id}</p>
                    </div>

                    <div className="flex gap-2">
                      {!inactive && (
                        <button onClick={() => startEdit(p)}
                          className="rounded-lg border border-gray-300 text-gray-700 px-3 py-2 hover:bg-gray-50">
                          Rediger
                        </button>
                      )}
                      {!inactive ? (
                        <button onClick={() => softRemove(p.id)} disabled={busyId === p.id}
                          className="rounded-lg border border-yellow-300 text-yellow-700 px-3 py-2 hover:bg-yellow-50 disabled:opacity-60">
                          {busyId === p.id ? "Deaktiverer…" : "Deaktiver"}
                        </button>
                      ) : (
                        <button onClick={() => restore(p.id)} disabled={busyId === p.id}
                          className="rounded-lg border border-green-300 text-green-700 px-3 py-2 hover:bg-green-50 disabled:opacity-60">
                          {busyId === p.id ? "Gendanner…" : "Gendan"}
                        </button>
                      )}
                      <button onClick={() => hardRemove(p.id)} disabled={busyId === p.id}
                        className="rounded-lg border border-red-300 text-red-600 px-3 py-2 hover:bg-red-50 disabled:opacity-60">
                        {busyId === p.id ? "Sletter…" : "Slet permanent"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm text-gray-600">Navn</span>
                        <input className="mt-1 w-full rounded-lg border px-3 py-2"
                          value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} />
                      </label>
                      <label className="block">
                        <span className="text-sm text-gray-600">Alder</span>
                        <input className="mt-1 w-full rounded-lg border px-3 py-2"
                          value={edit.age} onChange={(e) => setEdit((s) => ({ ...s, age: e.target.value }))} inputMode="numeric" />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-sm text-gray-600">Bio</span>
                      <textarea className="mt-1 w-full rounded-lg border px-3 py-2" rows={3}
                        value={edit.bio} onChange={(e) => setEdit((s) => ({ ...s, bio: e.target.value }))} />
                    </label>
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(p.id)} disabled={busyId === p.id}
                        className="rounded-lg bg-pink-500 text-white px-4 py-2 hover:opacity-95 disabled:opacity-60">
                        {busyId === p.id ? "Gemmer…" : "Gem"}
                      </button>
                      <button onClick={cancelEdit}
                        className="rounded-lg border border-gray-300 text-gray-700 px-4 py-2 hover:bg-gray-50">
                        Fortryd
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
