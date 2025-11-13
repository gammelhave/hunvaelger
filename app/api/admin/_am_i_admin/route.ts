import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? null;
  if (!email) return NextResponse.json({ ok: false }, { status: 401 });

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return NextResponse.json({ ok: false }, { status: 403 });

  return NextResponse.json({ ok: true, role: admin.role ?? "ADMIN" });
}
