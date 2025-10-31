import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ ok: false, error: "Intet id angivet" }, { status: 400 });
    }

    // hent eksisterende liste fra kv
    const raw = await kv.get("profiles");
    let profiles: any[] = [];

    if (typeof raw === "string") {
      try {
        profiles = JSON.parse(raw);
      } catch {
        profiles = [];
      }
    } else if (Array.isArray(raw)) {
      profiles = raw;
    }

    // find eksisterende profil
    const index = profiles.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ ok: false, error: "Profil ikke fundet" }, { status: 404 });
    }

    // opdater
    profiles[index] = { ...profiles[index], ...data, id };

    await kv.set("profiles", JSON.stringify(profiles));

    return NextResponse.json({ ok: true, profile: profiles[index] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Ukendt fejl" }, { status: 500 });
  }
}
