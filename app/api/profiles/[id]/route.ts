import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
};

function jsonErr(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

// GET /api/profiles/:id
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 1) Forsøg KV-hash
    const rawHash = await kv.hget<string>("profiles", id);
    if (rawHash) {
      return NextResponse.json({ ok: true, profile: JSON.parse(rawHash) as Profile });
    }

    // 2) Fallback: JSON-array i key "profiles"
    const arr = await kv.get<string>("profiles");
    if (arr) {
      const list: Profile[] = JSON.parse(arr);
      const found = list.find((p) => p.id === id);
      if (found) return NextResponse.json({ ok: true, profile: found });
    }

    return jsonErr("Not found", 404);
  } catch (e: any) {
    return jsonErr(e?.message || "Server error (GET)", 500);
  }
}

// PUT /api/profiles/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    let body: Partial<Profile>;
    try {
      body = await req.json();
    } catch {
      return jsonErr("Body skal være JSON", 400);
    }

    // Valider billeder
    if (body.images) {
      if (!Array.isArray(body.images)) return jsonErr("images must be an array", 400);
      if (body.images.length > 3) return jsonErr("Max 3 billeder", 400);
      body.images = body.images.map(String);
    }

    // 1) Forsøg KV-hash
    const rawHash = await kv.hget<string>("profiles", id);
    if (rawHash) {
      const current = JSON.parse(rawHash) as Profile;
      const next: Profile = { ...current, ...body, id: current.id };
      await kv.hset("profiles", { [id]: JSON.stringify(next) });
      return NextResponse.json({ ok: true, profile: next });
    }

    // 2) Fallback: JSON-array i key "profiles"
    const arr = await kv.get<string>("profiles");
    if (arr) {
      const list: Profile[] = JSON.parse(arr);
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) return jsonErr("Not found", 404);
      const next: Profile = { ...list[idx], ...body, id: list[idx].id };
      const newList = [...list];
      newList[idx] = next;
      await kv.set("profiles", JSON.stringify(newList));
      return NextResponse.json({ ok: true, profile: next });
    }

    return jsonErr("Not found", 404);
  } catch (e: any) {
    return jsonErr(e?.message || "Server error (PUT)", 500);
  }
}

// (valgfrit) DELETE /api/profiles/:id — håndterer begge lagringsformer
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const rawHash = await kv.hget<string>("profiles", id);
    if (rawHash) {
      await kv.hdel("profiles", id);
      return NextResponse.json({ ok: true });
    }

    const arr = await kv.get<string>("profiles");
    if (arr) {
      const list: Profile[] = JSON.parse(arr);
      const newList = list.filter((p) => p.id !== id);
      if (newList.length === list.length) return jsonErr("Not found", 404);
      await kv.set("profiles", JSON.stringify(newList));
      return NextResponse.json({ ok: true });
    }

    return jsonErr("Not found", 404);
  } catch (e: any) {
    return jsonErr(e?.message || "Server error (DELETE)", 500);
  }
}
