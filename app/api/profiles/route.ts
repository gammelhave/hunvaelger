// app/api/profiles/route.ts
import { NextResponse } from "next/server"

type Profile = {
  id: string
  name: string
  age?: number
  bio?: string
}

// Simpel in-memory “DB” (nulstilles ved redeploy)
const DB: Profile[] = [
  { id: "1", name: "Mads", age: 29, bio: "Kaffe, kajak og koncertfreak." },
  { id: "2", name: "Jonas", age: 34, bio: "Surdej, trail-løb og filmnørd." },
]

export async function GET() {
  return NextResponse.json({ ok: true, profiles: DB })
}

export async function POST(req: Request) {
  const data = await req.json().catch(() => ({}))
  const name = typeof data.name === "string" ? data.name.trim() : ""
  const age = data.age ? Number(data.age) : undefined
  const bio = typeof data.bio === "string" ? data.bio.trim() : ""

  if (!name) {
    return NextResponse.json({ ok: false, error: "Navn er påkrævet." }, { status: 400 })
  }

  const id = String(Date.now())
  const profile: Profile = { id, name, age: Number.isFinite(age) ? age : undefined, bio }
  DB.push(profile)

  return NextResponse.json({ ok: true, profile }, { status: 201 })
}
