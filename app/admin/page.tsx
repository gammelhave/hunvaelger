"use client"

import { useEffect, useState } from "react"

type Profile = { id: string; name: string; age?: number; bio?: string }

export default function AdminPage() {
  const [list, setList] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/profiles", { cache: "no-store" })
      const data = await res.json()
      setList(data?.profiles ?? [])
    } catch (e: any) {
      setError("Kunne ikke hente profiler.")
    } finally {
      setLoading(false)
    }
  }

  async function remove(id: string) {
    if (!confirm("Slet denne profil?")) return
    setBusyId(id)
    setError(null)
    try {
      const res = await fetch(`/api/profiles/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setList((prev) => prev.filter((p) => p.id !== id))
    } catch {
      setError("Kunne ikke slette profilen.")
    } finally {
      setBusyId(null)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Admin – Profiler</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p className="text-gray-600">Indlæser…</p>
      ) : list.length === 0 ? (
        <p className="text-gray-600">Ingen profiler.</p>
      ) : (
        <ul className="grid gap-4">
          {list.map((p) => (
            <li key={p.id} className="rounded-2xl border bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {p.name}{p.age ? `, ${p.age}` : ""}
                  </h3>
                  {p.bio && <p className="text-gray-700 mt-1">{p.bio}</p>}
                  <p className="text-xs text-gray-400 mt-2">ID: {p.id}</p>
                </div>
                <button
                  onClick={() => remove(p.id)}
                  disabled={busyId === p.id}
                  className="rounded-lg border border-red-300 text-red-600 px-3 py-2 hover:bg-red-50 disabled:opacity-60"
                >
                  {busyId === p.id ? "Sletter…" : "Slet"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
