// app/api/admin/profiles/create-test/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // VIGTIGT: samme import-style som de andre routes

export async function POST() {
  try {
    const profile = await prisma.profile.create({
      data: {
        name: "Testprofil",
        age: 28,
        bio: "Dette er en automatisk testprofil oprettet fra admin-siden.",
        // createdAt har sandsynligvis default i Prisma, så vi behøver ikke sætte den
      },
    });

    return NextResponse.json(
      { ok: true, profile },
      { status: 200 }
    );
  } catch (err) {
    console.error("CREATE TEST PROFILE ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Kunne ikke oprette testprofil" },
      { status: 500 }
    );
  }
}
