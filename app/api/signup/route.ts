// app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name } = body ?? {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email og adgangskode er påkrævet." },
        { status: 400 }
      );
    }

    // Simpel validering
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Ugyldig input." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Adgangskoden skal være mindst 8 tegn." },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (exists) {
      return NextResponse.json(
        { error: "Email er allerede i brug." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: typeof name === "string" ? name : null,
        passwordHash,
      },
      select: { id: true, email: true, name: true }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("POST /api/signup error:", err);
    return NextResponse.json(
      { error: "Kunne ikke oprette bruger." },
      { status: 500 }
    );
  }
}
