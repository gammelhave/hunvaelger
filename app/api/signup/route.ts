// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const runtime = "nodejs";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password skal være mindst 6 tegn"),
  name: z.string().min(1).max(100),
  age: z.coerce.number().int().min(18).max(99),
  bio: z.string().max(1000).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const data = signupSchema.parse(raw);

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed, // skal findes i din Prisma-model
        profile: {
          create: {
            name: data.name,
            age: data.age,
            bio: data.bio,
            // images: []  // <— fjernet for kompatibilitet
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json(
      { ok: true, userId: user.id, profileId: user.profile?.id },
      { status: 201 }
    );
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "EMAIL_EXISTS", message: "E-mail er allerede registreret" },
        { status: 409 }
      );
    }
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION", issues: err.issues },
        { status: 400 }
      );
    }
    console.error("SIGNUP_ERROR", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: "Kunne ikke oprette bruger" },
      { status: 500 }
    );
  }
}
