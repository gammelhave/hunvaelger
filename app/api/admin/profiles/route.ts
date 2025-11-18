// app/api/admin/profiles/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Hvis du vil låse det til admins kan vi senere tilføje getServerSession her.
// Lige nu holder vi det simpelt, så vi bare får det til at virke.

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    const dto = profiles.map((p) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      bio: p.bio,
      userEmail: p.user.email,
    }));

    return NextResponse.json({ ok: true, profiles: dto });
  } catch (err: any) {
    console.error("Fejl i /api/admin/profiles:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL",
        message: "Kunne ikke hente profiler",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
