import { NextResponse } from "next/server"
import { deleteProfile, updateProfile } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) return NextResponse.json({ ok: false, error: "Mangler id" }, { status: 400 })
  await deleteProfile(id)
  return NextResponse.json({ ok: true })
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) return NextResponse.json({ ok: false, error: "Mangler id" }, { status: 400 })

  const body = await req.json().catch(() => ({}))
  const name = typeof body.name === "string" ? body.name.trim() : undefined
  const age = Number.isFinite(Number(body.age)) ? Number(body.age) : undefined
  const bio = typeof body.bio === "string" ? body.bio.trim() : undefined

  const result = await updateProfile(id, { name, age, bio })
  if (!result.ok) return NextResponse.json(result, { status: 404 })
  return NextResponse.json({ ok: true, profile: result.profile })
}
