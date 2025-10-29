// app/p/page.tsx
export const dynamic = "force-dynamic"

import { readProfiles, type Profile } from "@/lib/db-kv"
import Link from "next/link"

type SearchParams = { [key: string]: string | string[] | undefined }

function bySort(sort: string) {
  if (sort === "name") {
    return (a: Profile, b: Profile) => (a.name ?? "").localeCompare(b.name ?? "")
  }
  if (sort === "oldest") {
    return (a: Profile, b: Profile) => Number(a.id) - Number(b.id)
  }
  // default newest
  return (a: Profile, b: Profile) => Number(b.id) - Number(a.id)
}

export default async function ProfilesPage({ searchParams }: { searchParams?: SearchParams }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q.trim() : ""
  const minAge = Number.isFinite(Number(searchParams?.minAge)) ? Number(searchParams!.minAge) : undefined
  const maxAge = Number.isFinite(Number(searchParams?.maxAge)) ? Number(searchParams!.maxAge) : undefined
  const sort = typeof searchParams?.sort === "string" ? searchParams!.sort : "newest"

  const page = Math.max(1, parseInt(String(searchParams?.page ?? "1"), 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(String(searchParams?.limit ?? "10"), 10) || 10))

  const all = await readProfiles()
  const active = all.filter((p) => p.active !== false)

  const matches = (p: Profile) => {
    if (q) {
      const s = q.toLowerCase()
      if (!((p.name ?? "").toLowerCase().includes(s) || (p.bio ?? "").toLowerCase().includes(s))) return false
    }
    if (minAge !== undefined && (p.age ?? -Infinity) < minAge) return false
    if (maxAge !== undefined && (p.age ?? Infinity) > maxAge) return false
    return true
  }

  const filtered = active.filter(matches).sort(bySort(sort))
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  const qs = (next: number) => {
    const usp = new URLSearchParams()
    if (q) usp.set("q", q)
    if (minAge !== undefined) usp.set("minAge", String(minAge))
    if (maxAge !== undefined) usp.set("maxAge", String(maxAge))
    if (sort && sort !== "newest") usp.set("sort", sort)
    if (limit !== 10) usp.set("limit", String(limit))
    usp.set("page", String(next))
    return `?${usp.toString()}`
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">Profiler</h1>

      {/* Filter-bar */}
      <form method="GET" className="mb-6 grid gap-2 md:grid-cols-[1fr,120px,120px,160px,auto]">
        <input name="q" defaultValue={q} placeholder="Søg navn eller bio…" className="rounded-lg border px-3 py-2" />
        <input name="minAge" defaultValue={minAge ?? ""} placeholder="Min alder" className="rounded-lg border px-3 py-2" inputMode="numeric" />
        <input name="maxAge" defaultValue={maxAge ?? ""} placeholder="Max alder" className="rounded-lg border px-3 py-2" inputMode="numeric" />
        <select name="sort" defaultValue={sort} className="rounded-lg border px-3 py-2">
          <option value="newest">Nyeste</option>
          <option value="oldest">Ældste</option>
          <option value="name">Navn (A→Å)</option>
        </select>
        <button className="rounded-lg bg-pink-500 text-white px-4 py-2">Filtrér</button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-600">
          Ingen profiler matcher. Prøv at{" "}
          <Link href="/tilmeld" className="text-pink-600 underline">oprette en</Link>.
        </p>
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {items.map((p) => (
              <li key={p.id} className="rounded-2xl border bg-white p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.name}{p.age ? `, ${p.age}` : ""}
                </h3>
                {p.bio && <p className="text-gray-700 mt-2">{p.bio}</p>}
              </li>
            ))}
          </ul>

          {/* Pager */}
          <div className="mt-8 flex items-center justify-between">
            <Link aria-disabled={page <= 1} className={`rounded-lg border px-3 py-2 ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`} href={qs(Math.max(1, page - 1))}>
              ← Forrige
            </Link>
            <p className="text-sm text-gray-600">Side {page} af {pages} — {total} profil{total === 1 ? "" : "er"}</p>
            <Link aria-disabled={page >= pages} className={`rounded-lg border px-3 py-2 ${page >= pages ? "pointer-events-none opacity-40" : "hover:bg-gray-50"}`} href={qs(Math.min(pages, page + 1))}>
              Næste →
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
