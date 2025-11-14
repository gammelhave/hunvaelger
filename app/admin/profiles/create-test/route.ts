// app/api/admin/profiles/create-test/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Denne API route opretter en testprofil til admin-dashboardet
export async function POST() {
  try {
    const profile = await prisma.profile.create({
      data: {
        name: "Testperson",
        age: 28,
        bio: "Dette er en automatisk genereret testprofil.",
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ ok: true, profile });
  } catch (err: any) {
    console.error("FEJL i create-test API:", err);
    return NextResponse.json(
      { ok: false, error: "Kunne ikke oprette testprofil" },
      { status: 500 }
    );
  }
}
