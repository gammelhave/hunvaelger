// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const runtime = "nodejs";

const prisma = new PrismaClient();

// Robust alder: accepterer string/number, trimmer, fjerner ikke-cifre, coercer til int 18–99
const ageSchema = z
  .union([z.string(), z.number()])
  .transform((v) => {
    if (typeof v === "number") return v;
    const cleaned = v.trim().replace(/[^\d]/g, ""); // fjerner “ år”, mellemrum, osv.
    return cleaned.length ? Number(cleaned) : NaN;
  })
  .pipe(z.number().int().min(18, "Alder skal være mindst 18").max(99, "Alder skal være under 100"));

const signupSchema = z.object({
  email: z.string().email("Ugyldig e-mail"),
  password: z.string().min(6, "Password skal være mindst 6 tegn"),
  name: z.string().min(1, "Navn mangler").max(100),
  age: ageSchema,
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
        password: hashed,
        profile: {
          create: {
            name: data.name,
            age: data.age,
            bio: data.bio,
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
