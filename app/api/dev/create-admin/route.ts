import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("x-admin-token");
    const secret = process.env.ADMIN_CREATE_TOKEN;

    // Sikkerhed: kræv korrekt token
    if (!secret || token !== secret) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Body er valgfri – vi bruger defaults hvis der ikke sendes noget
    let data: any = {};
    try {
      data = await req.json();
    } catch {
      // ingen body er ok
    }

    const email = data.email ?? "admin@hunvaelger.dk";
    const password = data.password ?? "Telefon1";

    if (!email || !password) {
      return new NextResponse("Missing email or password", { status: 400 });
    }

    // Tjek om bruger allerede findes
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({
        ok: true,
        user: existing,
        note: "User already existed",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // VIGTIGT: kun felter der findes i User-modellen
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash, // matcher User.password i schemaet
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (err: any) {
    console.error("CREATE-ADMIN ERROR:", err);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? "Unknown error",
        stack: String(err),
      },
      { status: 500 }
    );
  }
}
