import { NextResponse } from "next/server"
import { readProfiles, type Profile } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = (url.searchParams.get("q") || "").trim().toLowerCase()
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10) || 10))

  const all = await readProfiles() // admin ser ALT (aktive + deaktiverede)
  const matches = (p: Profile) =>
    !q ||
    (p.name ?? "").toLowerCase().includes(q) ||
    (p.bio ?? "").toLowerCase().includes(q)

  const filtered = all.filter(matches)
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / limit))
  const start = (page - 1) * limit
  const items = filtered.slice(start, start + limit)

  return NextResponse.json({ ok: true, items, total, page, pages, limit })
}
