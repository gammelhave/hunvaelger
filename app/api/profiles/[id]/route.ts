import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Profile = {
  id?: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
};

function jerr(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

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

    // 1) JSON-array
    const listStr = await kv.get<string>("profiles").catch(() => null);
    const list = parseList(listStr);
    if (list) {
      const found = list.find((p) => p.id === id);
      if (found) return NextResponse.json({ ok: true, profile: found });
    }

    // 2) Hash
    const fromHash = await tryHGet(id);
    if (fromHash) return NextResponse.json({ ok: true, profile: fromHash });

    return jerr("Not found", 404);
  } catch (e: any) {
    return jerr(e?.message || "Server error (GET)", 500);
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
      return jerr("Body skal være JSON", 400);
    }

    // validate images
    if (body.images) {
      if (!Array.isArray(body.images)) return jerr("images must be an array", 400);
      if (body.images.length > 3) return jerr("Max 3 billeder", 400);
      body.images = body.images.map(String);
    }

    // 1) JSON-array (primær lagring)
    const listStr = await kv.get<string>("profiles").catch(() => null);
    const list = parseList(listStr);
    if (list) {
      // prøv via id
      let idx = list.findIndex((p) => p.id === id);

      // hvis ikke findes, prøv match via (name+age) og uddel id
      if (idx === -1 && (body.name || body.age !== undefined)) {
        idx = list.findIndex(
          (p) =>
            p.name?.trim() === (body.name ?? p.name)?.trim() &&
            Number(p.age) === Number(body.age ?? p.age)
        );
        if (idx !== -1 && !list[idx].id) {
          list[idx].id = id; // stabiliser fremadrettet
        }
      }

      if (idx === -1) return jerr("Not found", 404);

      const merged: Profile = {
        ...list[idx],
        ...body,
        id: list[idx].id ?? id,
      };

      const newList = [...list];
      newList[idx] = merged;

      await kv.set("profiles", JSON.stringify(newList));
      return NextResponse.json({ ok: true, profile: merged });
    }

    // 2) Hash fallback
    const current = await tryHGet(id);
    if (!current) return jerr("Not found", 404);

    const merged: Profile = { ...current, ...body, id: current.id ?? id };
    const ok = await tryHSet(merged.id!, merged);
    if (!ok) return jerr("Kunne ikke gemme (hash)", 500);

    return NextResponse.json({ ok: true, profile: merged });
  } catch (e: any) {
    return jerr(e?.message || "Server error (PUT)", 500);
  }
}

// DELETE (valgfri)
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const listStr = await kv.get<string>("profiles").catch(() => null);
    const list = parseList(listStr);
    if (list) {
      const newList = list.filter((p) => p.id !== id);
      if (newList.length === list.length) return jerr("Not found", 404);
      await kv.set("profiles", JSON.stringify(newList));
      return NextResponse.json({ ok: true });
    }

    const ok = await tryHDel(id);
    if (!ok) return jerr("Not found", 404);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return jerr(e?.message || "Server error (DELETE)", 500);
  }
}
