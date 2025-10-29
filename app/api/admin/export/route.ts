import { NextResponse } from "next/server"
import { readProfiles } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

function toCSV(rows: any[]) {
  const header = ["id", "name", "age", "bio", "active", "deletedAt"]
  const safe = (v: any) => {
    if (v === null || v === undefined) return ""
    const s = String(v)
    // Escape: wrap in quotes if it has quotes/newlines/commas; double quotes inside
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  const lines = [
    header.join(","),
    ...rows.map((r) => header.map((k) => safe(r[k])).join(",")),
  ]
  return lines.join("\n")
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const format = (url.searchParams.get("format") || "csv").toLowerCase()

  const all = await readProfiles()
  // inkluderer både aktive og inaktive; det er admin-eksport
  const rows = all.map((p) => ({
    id: p.id,
    name: p.name ?? "",
    age: p.age ?? "",
    bio: p.bio ?? "",
    active: p.active !== false, // default true
    deletedAt: p.deletedAt ?? "",
  }))

  const ts = new Date()
  const pad = (n: number) => n.toString().padStart(2, "0")
  const fnameBase = `profiles-${ts.getFullYear()}${pad(ts.getMonth() + 1)}${pad(ts.getDate())}-${pad(ts.getHours())}${pad(ts.getMinutes())}`

  if (format === "json") {
    const body = JSON.stringify({ profiles: rows }, null, 2)
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fnameBase}.json"`,
        "Cache-Control": "no-store",
      },
    })
  }

  // default: CSV
  const csv = toCSV(rows)
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fnameBase}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
