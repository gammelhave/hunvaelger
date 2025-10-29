import { NextResponse } from "next/server"
import { softDeleteProfile, hardDeleteProfile, updateProfile, restoreProfile } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

// ?hard=1 gør sletning permanent, ellers soft delete
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) return NextResponse.json({ ok: false, error: "Mangler id" }, { status: 400 })
  const url = new URL(req.url)
  const hard = url.searchParams.get("hard") === "1"

  if (hard) {
    await hardDeleteProfile(id)
  } else {
    const r = await softDeleteProfile(id)
    if (!r.ok) return NextResponse.json(r, { status: 404 })
  }
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

// POST /api/profiles/[id]/restore
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) return NextResponse.json({ ok: false, error: "Mangler id" }, { status: 400 })
  const r = await restoreProfile(id)
  if (!r.ok) return NextResponse.json(r, { status: 404 })
  return NextResponse.json({ ok: true, profile: r.profile })
}
