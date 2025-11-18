// app/api/admin/profiles/list/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    // Tjek admin-login
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ ok: false, error: "NOT_ADMIN" }, { status: 403 });
    }

    // Hent ALLE profiler – ingen 404 i LIST-endpoint
    const profiles = await prisma.profile.findMany({
      include: {
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { ok: true, profiles },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL_ERROR",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
