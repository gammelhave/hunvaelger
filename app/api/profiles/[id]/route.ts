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

// --- helpers ---
function parseList(s: string | null): Profile[] | null {
  if (!s) return null;
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? (v as Profile[]) : null;
  } catch {
    return null;
  }
}

async function tryHGet(id: string): Promise<Profile | null> {
  try {
    const raw = await kv.hget<string>("profiles", id);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    // WRONGTYPE eller andet -> behandl som ikke-eksisterende i hash
    return null;
  }
}

async function tryHSet(id: string, p: Profile): Promise<boolean> {
  try {
    await kv.hset("profiles", { [id]: JSON.stringify(p) });
    return true;
  } catch {
    return false;
  }
}

async function tryHDel(id: string): Promise<boolean> {
  try {
    await kv.hdel("profiles", id);
    return true;
  } catch {
    return false;
  }
}

// GET /api/profiles/:id
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 1) Prøv JSON-array i key "profiles"
    const listStr = await kv.get<string>("profiles").catch(() => null);
    const list = parseList(listStr);
    if (list) {
      const found = list.find((p) => p.id === id);
      if (found) return NextResponse.json({ ok: true, profile: found });
    }

    // 2) Fallback: hash "profiles"
    const fromHash = await tryHGet(id);
    if (fromHash) return NextResponse.json({ ok: true, profile: fromHash });

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

    if (body.images) {
      if (!Array.isArray(body.images)) return jsonErr("images must be an array", 400);
      if (body.images.length > 3) return jsonErr("Max 3 billeder", 400);
      body.images = body.images.map(String);
    }

    // 1) Prøv JSON-array modellen
    const listStr = await kv.get<string>("profiles").catch(() => null);
    const list = parseList(listStr);
    if (list) {
      const idx = list.findIndex((p) => p.id === id);
      if (idx === -1) return jsonErr("Not found", 404);
      const next: Profile = { ...list[idx], ...body, id: list[idx].id };
      const newList = [...list];
      newList[idx] = next;
      await kv.set("profiles", JSON.stringify(newList));
      return NextResponse.json({ ok: true, profile: next });
    }

    // 2) Fallback: hash-modellen
    const current = await tryHGet(id);
    if (!current) return jsonErr("Not found", 404);
    const next: Profile = { ...current, ...body, id: current.id };
    const ok = await tryHSet(id, next);
    if (!ok) return jsonErr("Kunne ikke gemme (hash)", 500);
    return NextResponse.json({ ok: true, profile: next });
  } catch (e: any) {
    return jsonErr(e?.message || "Server error (PUT)", 500);
  }
}

// DELETE /api/profiles/:id
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 1) JSON-array
    const listStr = await kv.get<string>("profiles").catch(() => null);
    const list = parseList(listStr);
    if (list) {
      const newList = list.filter((p) => p.id !== id);
      if (newList.length === list.length) return jsonErr("Not found", 404);
      await kv.set("profiles", JSON.stringify(newList));
      return NextResponse.json({ ok: true });
    }

    // 2) Hash
    const ok = await tryHDel(id);
    if (!ok) return jsonErr("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return jsonErr(e?.message || "Server error (DELETE)", 500);
  }
}
