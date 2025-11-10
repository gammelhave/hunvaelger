import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const idSchema = z.string().min(1);

/**
 * GET /api/profiles/[id]
 * Returnerer en enkelt profil.
 */
export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = idSchema.parse(ctx.params.id);

    const profile = await prisma.profile.findUnique({
      where: { id },
      select: { id: true, name: true, age: true, bio: true, userId: true, createdAt: true },
    });

    if (!profile) {
      return NextResponse.json({ ok: false, error: "NOT_FOUND", message: "Profil blev ikke fundet" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, profile });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ ok: false, error: "VALIDATION", issues: err.issues }, { status: 400 });
    }
    console.error("PROFILE_GET_ERROR", err);
    return NextResponse.json({ ok: false, error: "INTERNAL", message: "Kunne ikke hente profil" }, { status: 500 });
  }
}
