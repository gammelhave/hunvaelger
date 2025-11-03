// app/api/profiles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { requireWomanSession } from "@/lib/auth";

type Profile = {
  id: string;
  userId: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
  slug: string; // QR-slug
};

function makeSlug(name: string, age: number) {
  const base = String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "profil"}-${Number(age) || 0}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

async function loadList(): Promise<Profile[]> {
  try {
    const raw = await kv.get<string>("profiles");
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? (list as Profile[]) : [];
  } catch {
    return [];
  }
}

async function saveList(list: Profile[]) {
  await kv.set("profiles", JSON.stringify(list));
}

export async function GET() {
  const list = await loadList();
  return NextResponse.json({ ok: true, profiles: list });
}

export async function POST(req: NextRequest) {
  const guard = await requireWomanSession();
  if (!guard.ok) {
    return NextResponse.json(
      { ok: false, error: guard.error },
      { status: guard.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const age = Number(body?.age ?? 0);
    const bio = String(body?.bio ?? "");
    const images: string[] = Array.isArray(body?.images)
      ? body.images.slice(0, 3).map(String)
      : [];

    if (!name || !age) {
      return NextResponse.json(
        { ok: false, error: "Navn og alder er påkrævet" },
        { status: 400 }
      );
    }

    const list = await loadList();

    const profile: Profile = {
      id: crypto.randomUUID(),
      userId: guard.user.id,
      name,
      age,
      bio,
      images,
      slug: makeSlug(name, age),
    };

    list.push(profile);
    await saveList(list);

    return NextResponse.json({ ok: true, profile });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Serverfejl" },
      { status: 500 }
    );
  }
}
