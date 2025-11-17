// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Helper: "" -> undefined + trim
const emptyToUndef = (v: unknown) => {
  if (typeof v === "string") {
    const t = v.trim();
    return t === "" ? undefined : t;
  }
  return v;
};

const SignupSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Ugyldig e-mail" }),
  password: z.string().min(6, "Adgangskode skal være mindst 6 tegn"),
  confirm: z.preprocess(emptyToUndef, z.string().optional()),
  name: z.preprocess(emptyToUndef, z.string().min(1).optional()),
  age: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.number().int().min(18).max(120).optional()
  ),
  bio: z.preprocess(emptyToUndef, z.string().max(1000).optional()),
});

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = SignupSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION",
          message: "Ugyldige felter",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password, confirm, name, age, bio } = parsed.data;

    if (typeof confirm === "string" && confirm !== password) {
      return NextResponse.json(
        {
          ok: false,
          error: "VALIDATION",
          message: "Adgangskoderne matcher ikke",
        },
        { status: 400 }
      );
    }

    // Duplikat-check
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        {
          ok: false,
          error: "DUPLICATE",
          message: "E-mail er allerede registreret",
        },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const fallbackName =
      name ?? (email.includes("@") ? email.split("@")[0] : "Bruger");

    // Opret bruger + profil i én transaktion
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          // VIGTIGT: gem hashet i feltet `password`, som Prisma kræver
          password: hash,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          name: fallbackName,
          age: age ?? 0,
          bio: bio ?? null,
          images: [], // tom liste til billeder
        },
      });

      return user;
    });

    return NextResponse.json(
      { ok: true, userId: result.id, email: result.email },
      { status: 201 }
    );
  } catch (err: any) {
    if (err?.code === "P2002") {
      return NextResponse.json(
        {
          ok: false,
          error: "DUPLICATE",
          message: "E-mail er allerede registreret",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: "INTERNAL",
        message: "Kunne ikke oprette bruger",
        detail: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
