import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ⚠️ Denne route bør kun bruges én gang til at oprette en admin-bruger.
// Husk at slette filen, når du har bekræftet at login virker.

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");

  // Tjek hemmelig token mod miljøvariablen
  if (!token || token !== process.env.ADMIN_CREATE_TOKEN) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password, name } = await req.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Ugyldig email eller adgangskode (min. 8 tegn)" },
        { status: 400 }
      );
    }

    const normEmail = String(email).toLowerCase().trim();

    // Tjek om brugeren allerede findes
    const exists = await prisma.user.findUnique({ where: { email: normEmail } });
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Email findes allerede i databasen" },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Opret admin-bruger
    const user = await prisma.user.create({
      data: {
        email: normEmail,
        name: name?.trim() || "Admin",
        passwordHash,
        // hvis du har en rolle i schemaet, kan du tilføje:
        // role: "ADMIN",
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch (e: any) {
    console.error("Fejl i create-admin:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Uventet fejl" },
      { status: 500 }
    );
  }
}
