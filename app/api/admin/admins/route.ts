import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function requireMaster() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email || "";
  const me = await prisma.admin.findUnique({ where: { email } });
  if (!me || me.role !== "MASTER") throw new Error("FORBIDDEN");
}

export async function GET() {
  try {
    await requireMaster();
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json({ ok: true, admins });
  } catch {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
}

export async function POST(req: Request) {
  try {
    await requireMaster();
    const { email, role } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
    const admin = await prisma.admin.upsert({
      where: { email },
      update: { role: role === "MASTER" ? "MASTER" : "ADMIN" },
      create: { email, role: role === "MASTER" ? "MASTER" : "ADMIN" },
    });
    return NextResponse.json({ ok: true, admin });
  } catch {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
}

export async function DELETE(req: Request) {
  try {
    await requireMaster();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: "email_required" }, { status: 400 });
    await prisma.admin.delete({ where: { email } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
}
