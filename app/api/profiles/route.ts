// app/api/profiles/route.ts
import { NextResponse } from "next/server"
import { readProfiles, addProfile } from "@/lib/db"

export const dynamic = "force-dynamic" // undgå caching af API på build-time

export async function GET() {
  const profiles = await readProfiles()
  return NextResponse.json({ ok: true, profiles })
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}))
    const name = typeof data.name === "string" ? data.name.trim() : ""
    const age = data.age ? Number(data.age) : undefined
    const bio = typeof data.bio === "string" ? data.bio.trim() : ""

    if (!name) {
      return NextResponse.json({ ok: false, error: "Navn er påkrævet." }, { status: 400 })
    }

    const profile = await addProfile({
      name,
      age: Number.isFinite(age) ? age : undefined,
      bio,
    })

    return NextResponse.json({ ok: true, profile }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Serverfejl" }, { status: 500 })
  }
}
