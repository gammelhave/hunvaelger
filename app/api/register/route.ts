// app/api/register/route.ts
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { ok: false, error: "Mangler felter: email, password, name" },
        { status: 400 }
      );
    }

    // findes allerede?
    const exists = await getUserByEmail(email);
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Bruger findes allerede" },
        { status: 409 }
      );
    }

    // createUser (i lib/auth.ts) opretter som 'female'
    const u = await createUser(email, password, name);

    return NextResponse.json({
      ok: true,
      user: { email: u.email, gender: u.gender, name: u.name }
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Serverfejl" },
      { status: 500 }
    );
  }
}
