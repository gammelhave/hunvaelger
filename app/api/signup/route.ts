// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Zod schema – gør age/bio valgfrie og accepterer tom streng.
 * - email: påkrævet
 * - password: påkrævet, min 8
 * - name: valgfri (hvis ikke givet, bruger vi delen før @ i email til profil)
 * - age: valgfri (int), min 18 hvis givet; "" => undefined
 * - bio: valgfri; "" => undefined
 */
const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password skal være mindst 8 tegn"),
  name: z
    .string()
    .trim()
    .transform((v) => (v.length ? v : undefined))
    .optional(),
  age: z
    .preprocess((v) => {
      if (v === "" || v === null || typeof v === "undefined") return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : v;
    }, z.number().int().min(18, "Alder skal være mindst 18").max(120, "Alder virker for høj").optional()),
  bio: z
    .string()
    .trim()
    .transform((v) => (v.length ? v : undefined))
    .optional(),
});

type SignupInput = z.infer<typeof SignupSchema>;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as unknown;

    const parsed = SignupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION",
          issues: parsed.error.issues,
          message: "Ugyldigt input",
        },
        { status: 400 }
      );
    }
    const { email, password, name, age, bio } = parsed.data as SignupInput;

    // Findes email allerede?
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "CONFLICT", message: "Email er allerede i brug." },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    // Opret bruger + evt. profil i en transaktion
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email,
          password: hash,
        },
      });

      // Opret profil kun hvis der faktisk er profiloplysninger
      const shouldCreateProfile = Boolean(name || typeof age !== "undefined" || bio);
      if (shouldCreateProfile) {
        await tx.profile.create({
          data: {
            userId: u.id,
            name: name ?? email.split("@")[0],
            age: typeof age === "number" ? age : undefined,
            bio: bio ?? undefined,
            images: [], // tom liste fra start
          },
        });
      }

      return u;
    });

    return NextResponse.json(
      {
        ok: true,
        userId: user.id,
        message: "Bruger oprettet",
      },
      { status: 201 }
    );
  } catch (err: any) {
    // Prisma unique constraint
    if (err?.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "CONFLICT", message: "Email er allerede i brug." },
        { status: 409 }
      );
    }

    console.error("Signup error:", err);
    return NextResponse.json(
      { ok: false, error: "INTERNAL", message: "Kunne ikke oprette bruger" },
      { status: 500 }
    );
  }
}
