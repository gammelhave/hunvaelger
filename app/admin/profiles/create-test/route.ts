// app/api/admin/profiles/create-test/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request) {
  try {
    const p = await prisma.profile.create({
      data: {
        name: "Testprofil",
        age: 28,
        bio: "Dette er en automatisk testprofil.",
      },
    });

    return NextResponse.json({ ok: true, id: p.id }, { status: 200 });
  } catch (err) {
    console.error("CREATE TEST PROFILE ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Kunne ikke oprette testprofil" },
      { status: 500 }
    );
  }
}
