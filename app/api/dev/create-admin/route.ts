import { NextResponse } from "next/server";
<<<<<<< HEAD
=======
<<<<<<< HEAD
import { PrismaClient } from "@prisma/client";
>>>>>>> 4a4117d (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
import bcrypt from "bcryptjs";
// Brug alias hvis du har "@/*" sat op i tsconfig/jsconfig, ellers skift til relativ sti:
// import { prisma } from "../../../lib/prisma";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
<<<<<<< HEAD
=======

  // Tjek hemmelig token mod miljøvariablen
=======
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // husk lib/prisma.ts

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
>>>>>>> 9b82aed (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
>>>>>>> 4a4117d (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
  if (!token || token !== process.env.ADMIN_CREATE_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password, name } = await req.json();
<<<<<<< HEAD

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Ugyldig email/password (min. 8 tegn)" },
        { status: 400 }
      );
    }

    const normEmail = String(email).toLowerCase().trim();

    const exists = await prisma.user.findUnique({ where: { email: normEmail } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email findes allerede" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
<<<<<<< HEAD
      data: { email: normEmail, name: name?.trim() || "Admin", passwordHash },
=======
      data: {
        email: normEmail,
        name: name?.trim() || "Admin",
        passwordHash,
      },
=======
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ ok: false, error: "Ugyldig email/password (min. 8 tegn)" }, { status: 400 });
    }

    const normEmail = String(email).toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email: normEmail } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Email findes allerede" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email: normEmail, name: name?.trim() || "Admin", passwordHash },
>>>>>>> 9b82aed (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
>>>>>>> b020bca (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
    console.error("Fejl i create-admin:", e);
>>>>>>> 4a4117d (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Fejl" },
      { status: 500 }
    );
=======
    return NextResponse.json({ ok: false, error: e?.message ?? "Fejl" }, { status: 500 });
>>>>>>> 9b82aed (Auth/DB: add Prisma schema+migrations, lib/prisma, create-admin route; remove duplicate .jsx pages; jsconfig alias)
  }
}
