import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  const secret = process.env.ADMIN_CREATE_TOKEN;

  if (!secret || token !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();
  const { email, password, name } = data;

  if (!email || !password) {
    return new NextResponse("Missing email or password", { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new NextResponse("User already exists", { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name || "Admin",
    },
  });

  return NextResponse.json({ ok: true, user });
}
