// app/api/profiles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import prisma from "@/lib/prisma";

// Hent en profil på id (offentligt)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil ikke fundet." }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (err) {
    console.error(`GET /api/profiles/${params.id} error:`, err);
    return NextResponse.json({ error: "Fejl ved hentning af profil." }, { status: 500 });
  }
}

// Opdater en specifik profil (kræver ejerskab af profilen eller evt. admin-rolle)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Ikke logget ind." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ error: "Bruger ikke fundet." }, { status: 404 });
    }

    const existing = await prisma.profile.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Profil ikke fundet." }, { status: 404 });
    }

    // Basal ejerskabskontrol: kun ejeren (samme userId) må opdatere
    if (existing.userId && existing.userId !== user.id) {
      return NextResponse.json({ error: "Adgang nægtet." }, { status: 403 });
    }

    const data = await req.json().catch(() => ({}));
    const allowed = (({ displayName, bio, age, city, imageUrl }) => ({
      displayName,
      bio,
      age,
      city,
      imageUrl,
    }))(data || {});

    const updated = await prisma.profile.update({
      where: { id: params.id },
      data: allowed,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(`PATCH /api/profiles/${params.id} error:`, err);
    return NextResponse.json({ error: "Kunne ikke opdatere profil." }, { status: 500 });
  }
}
