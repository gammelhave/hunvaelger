import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
};

// Hent én profil (GET /api/profiles/:id)
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const raw = await kv.hget<string>("profiles", id);
  if (!raw) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, profile: JSON.parse(raw) as Profile });
}

// Opdatér profil (PUT /api/profiles/:id)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json(); // fx { name, age, bio, images }

  const raw = await kv.hget<string>("profiles", id);
  if (!raw) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  const current = JSON.parse(raw) as Profile;
  const next: Profile = { ...current, ...body };

  // Valider billeder
  if (next.images) {
    if (!Array.isArray(next.images)) {
      return NextResponse.json({ ok: false, error: "images must be an array" }, { status: 400 });
    }
    if (next.images.length > 3) {
      return NextResponse.json({ ok: false, error: "Max 3 billeder" }, { status: 400 });
    }
  }

  await kv.hset("profiles", { [id]: JSON.stringify(next) });
  return NextResponse.json({ ok: true, profile: next });
}
