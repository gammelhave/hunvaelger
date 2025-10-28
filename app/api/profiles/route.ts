// app/api/profiles/route.ts
import { NextResponse } from "next/server"

type Profile = {
  id: string
  name: string
  age?: number
  bio?: string
}

const DB: Profile[] = [
  { id: "1", name: "Mads", age: 29, bio: "Kaffe, kajak og koncertfreak." },
  { id: "2", name: "Jonas", age: 34, bio: "Laver surdej, løber trail og elsker film." },
]

export async function GET() {
  return NextResponse.json({ ok: true, profiles: DB })
}

export async function POST(req: Request) {
  const data = await req.json()
  const id = String(Date.now())
  const profile: Profile = { id, name: data.name ?? "Ukendt", age: data.age ? Number(data.age) : undefined, bio: data.bio ?? "" }
  DB.push(profile)
  return NextResponse.json({ ok: true, profile }, { status: 201 })
}
