import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // eller: import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_CREATE_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Ugyldig email/password (min. 8 tegn)" },
        { status: 400 }
      );
    }

    const normEmail = String(email).toLowerCase().trim();

    const exists = await prisma.user.findUnique({ where: { email: normEmail } });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Email findes allerede" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: normEmail,
        name: name?.trim() || "Admin",
        passwordHash,
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Fejl" },
      { status: 500 }
    );
  }
}
