// app/api/admin/profiles/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: { id: string };
};

// GET /api/admin/profiles/:id
export async function GET(req: Request, { params }: RouteContext) {
  try {
    const id = params.id;

    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Profil ikke fundet" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      profile: {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        email: profile.user?.email ?? null,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL",
        message: "Kunne ikke hente profil",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/profiles/:id
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const id = params.id;

    const existing = await prisma.profile.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Profil ikke fundet" },
        { status: 404 }
      );
    }

    // Foreløbig sletter vi kun profilen. (User kan evt. tages i brug senere)
    await prisma.profile.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL",
        message: "Kunne ikke slette profil",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
