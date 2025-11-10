// app/api/profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import prisma from "@/lib/prisma";

// Hent en simpel liste af profiler (offentligt endpoint)
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      // Hvis din Profile-model har felter som er "tunge" (fx store description-felter),
      // kan du evt. vælge/selecte specifikke felter her.
    });
    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("GET /api/profiles error:", err);
    return NextResponse.json({ error: "Kunne ikke hente profiler." }, { status: 500 });
  }
}

// Opret/Opdater min profil (kræver login).
// Strategi: upsert på userId (forudsætter unikt userId i Profile)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Ikke logget ind." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { displayName, bio, age, city, imageUrl } = body ?? {};

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Bruger ikke fundet." }, { status: 404 });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id }, // kræver @unique på userId i Prisma
      update: {
        displayName,
        bio,
        age,
        city,
        imageUrl,
      },
      create: {
        userId: user.id,
        displayName: displayName ?? user.name ?? "",
        bio: bio ?? "",
        age: age ?? null,
        city: city ?? null,
        imageUrl: imageUrl ?? null,
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (err) {
    console.error("POST /api/profiles error:", err);
    return NextResponse.json({ error: "Kunne ikke gemme profil." }, { status: 500 });
  }
}
