// app/api/profiles/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  // TODO: hent rigtige profiler herfra
  return NextResponse.json({ ok: true, profiles: [] })
}

// Hvis du også vil kunne oprette profiler:
// export async function POST(req: Request) {
//   const data = await req.json()
//   // TODO: gem data
//   return NextResponse.json({ ok: true, created: true, data }, { status: 201 })
// }
