import { NextResponse } from "next/server"
import { deleteProfile } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) {
    return NextResponse.json({ ok: false, error: "Mangler id" }, { status: 400 })
  }
  await deleteProfile(id)
  return NextResponse.json({ ok: true })
}
