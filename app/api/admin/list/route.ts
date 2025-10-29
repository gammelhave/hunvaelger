import { NextResponse } from "next/server"
import { readProfiles, type Profile } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

function bySort(sort: string) {
  if (sort === "name") return (a: Profile, b: Profile) => (a.name ?? "").localeCompare(b.name ?? "")
  if (sort === "oldest") return (a: Profile, b: Profile) => Number(a.id) - Number(b.id)
  return (a: Profile, b: Profile) => Number(b.id) - Number(a.id) // newest default
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  const minAge = Number.isFinite(Number(url.searchParams.get("minAge"))) ? Number(url.searchParams.get("minAge")) : undefined
  const maxAge = Number.isFinite(Number(url.searchParams.get("maxAge"))) ? Number(url.searchParams.get("maxAge")) : undefined
  const sort = (url.searchParams.get("sort") || "newest").toLowerCase()

  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10) || 10))

  const all = await readProfiles() // admin: alle
  const matches = (p: Profile) => {
    if (q) {
      const s = q
      if (!((p.name ?? "").toLowerCase().includes(s) || (p.bio ?? "").toLowerCase().includes(s))) return false
    }
    if (minAge !== undefined && (p.age ?? -Infinity) < minAge) return false
    if (maxAge !== undefined && (p.age ?? Infinity) > maxAge) return false
    return true
  }

  const filtered = all.filter(matches).sort(bySort(sort))
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  return NextResponse.json({ ok: true, items, total, page, pages, limit })
}
