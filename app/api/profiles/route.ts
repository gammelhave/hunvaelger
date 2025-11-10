import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const profileSchema = z.object({
  name: z.string().min(1, "Navn er påkrævet").max(100),
  age: z.coerce.number().int().min(18, "Alder skal være mindst 18").max(99, "Alder skal være under 100"),
  bio: z.string().max(1000).optional().default(""),
});

// GET /api/profiles – hent alle profiler
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || "100");

  const profiles = await prisma.profile.findMany({
    take: Math.max(1, Math.min(limit, 500)),
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, age: true, bio: true, userId: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, profiles });
}

// POST /api/profiles – opret ny profil
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = profileSchema.parse(body);

    const profile = await prisma.profile.create({
      data: {
        name: data.name,
        age: data.age,
        bio: data.bio,
      },
      select: { id: true, name: true, age: true, bio: true, createdAt: true },
    });

    return NextResponse.json({ ok: true, profile }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json({ ok: false, error: "VALIDATION", issues: err.issues }, { status: 400 });
    }
    console.error("PROFILES_POST_ERROR", err);
    return NextResponse.json({ ok: false, error: "INTERNAL", message: "Kunne ikke oprette profil" }, { status: 500 });
  }
}
