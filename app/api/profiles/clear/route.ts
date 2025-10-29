import { NextResponse } from "next/server"
import { clearProfilesHard } from "@/lib/db-kv"

export const dynamic = "force-dynamic"

export async function POST() {
  await clearProfilesHard()
  return NextResponse.json({ ok: true })
}
