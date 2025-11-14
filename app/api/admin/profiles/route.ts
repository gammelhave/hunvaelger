// app/api/admin/profiles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ok: true, profiles }, { status: 200 });
  } catch (err) {
    console.error("ADMIN PROFILES LIST ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Kunne ikke hente profiler" },
      { status: 500 }
    );
  }
}
