import { NextResponse } from "next/server"
import { clearProfiles } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

export async function POST() {
  await clearProfiles()
  return NextResponse.json({ ok: true })
}
