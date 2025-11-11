// app/api/profiles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toStringArray(val: any): string[] {
  if (!Array.isArray(val)) return [];
  return val.filter((x) => typeof x === "string" && x.trim().length > 0);
}

// GET: list profiles (til admin/list og /p)
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, profiles });
  } catch (err) {
    console.error("GET /api/profiles error:", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: "Kunne ikke hente profiler" },
      { status: 500 }
    );
  }
}

// POST: create profile
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = (body?.name ?? "").toString().trim();
    const ageNum = Number(body?.age);
    const bio =
      typeof body?.bio === "string" && body.bio.trim().length > 0
        ? body.bio.trim()
        : undefined;

    // vigtigst: images SKAL være en string[]
    const images: string[] = toStringArray(body?.images);

    if (!name || !Number.isFinite(ageNum)) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION", message: "Ugyldige felter" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        name,
        age: ageNum,
        bio,
        images, // gemmer tom liste hvis intet blev sendt
        // userId: "...", // hvis du knytter profiler til en bruger, sæt det her
      },
    });

    return NextResponse.json({ ok: true, profile }, { status: 201 });
  } catch (err) {
    console.error("POST /api/profiles error:", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: "Kunne ikke oprette profil" },
      { status: 500 }
    );
  }
}
