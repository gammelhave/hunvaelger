// app/api/admin/profiles/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: { id: string };
};

// Hent én profil
export async function GET(_req: Request, { params }: Params) {
  const id = params.id;

  try {
    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Profil ikke fundet" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, profile });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Fejl ved hentning af profil" },
      { status: 500 }
    );
  }
}

// Slet profil
export async function DELETE(_req: Request, { params }: Params) {
  const id = params.id;

  try {
    // Tjek først om den findes
    const existing = await prisma.profile.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Profil ikke fundet" },
        { status: 404 }
      );
    }

    await prisma.profile.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE PROFILE ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Kunne ikke slette profil" },
      { status: 500 }
    );
  }
}
