import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// Robust alder: accepterer string/number, renser og coerces til tal
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

    // Opret bruger + profil i én transaktion
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

    return NextResponse.json({ ok: true, userId: user.id, profileId: user.profile?.id }, { status: 201 });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "EMAIL_EXISTS", message: "E-mail er allerede registreret" },
        { status: 409 }
      );
    }
    if (err?.name === "ZodError") {
      return NextResponse.json({ ok: false, error: "VALIDATION", issues: err.issues }, { status: 400 });
    }

    const code = err?.code || err?.name || "INTERNAL";
    const message = err?.meta?.cause || err?.message || "Kunne ikke oprette bruger";
    console.error("SIGNUP_ERROR", err);
    return NextResponse.json({ ok: false, error: code, message }, { status: 500 });
  }
}
