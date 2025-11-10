import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Robust alder: accepter string/number, rens og coerces til int 18–99
const ageSchema = z
  .union([z.string(), z.number()])
  .transform((v) => {
    if (typeof v === "number") return v;
    const cleaned = v.trim().replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : NaN;
  })
  .pipe(z.number().int().min(18, "Alder skal være mindst 18").max(99, "Alder skal være under 100"));

const signupSchema = z.object({
  email: z.string().email("Ugyldig e-mail"),
  password: z.string().min(6, "Password skal være mindst 6 tegn"),
  name: z.string().min(1, "Navn er påkrævet").max(100),
  age: ageSchema,
  bio: z.string().max(1000).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const data = signupSchema.parse(raw);

    const hashed = await bcrypt.hash(data.password, 10);

    // Opret User + Profile i én transaktion
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashed, // kræver password String i Prisma User-model
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
    // Unik e-mail (Prisma)
    if (err?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "EMAIL_EXISTS", message: "E-mail er allerede registreret" },
        { status: 409 }
      );
    }

    // Zod validation
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { ok: false, error: "VALIDATION", issues: err.issues },
        { status: 400 }
      );
    }

    // Debug-venlig fallback
    const code = err?.code || err?.name || "INTERNAL";
    const message = err?.meta?.cause || err?.message || "Kunne ikke oprette bruger";
    console.error("SIGNUP_ERROR", err);
    return NextResponse.json({ ok: false, error: code, message }, { status: 500 });
  }
}
