// app/api/profiles/[id]/route.ts
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
  slug: string;
};

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

function sanitizeImages(images: any): string[] | undefined {
  if (!images) return undefined;
  if (!Array.isArray(images)) return undefined;
  return images.slice(0, 3).map(String);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireWomanSession();
  if (!guard.ok) {
    return NextResponse.json(
      { ok: false, error: guard.error },
      { status: guard.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  try {
    const id = params.id;
    const body = await req.json();

    const list = await loadList();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    // ejer-check
    if (list[idx].userId !== guard.user.id) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }

    // Kun tillad redigering af disse felter
    const next = { ...list[idx] };

    if (typeof body.name === "string") next.name = body.name.trim();
    if (body.age !== undefined) next.age = Number(body.age);
    if (typeof body.bio === "string") next.bio = body.bio;
    const imgs = sanitizeImages(body.images);
    if (imgs) next.images = imgs;

    // Valgfri: regenerér slug på opfordring
    if (body?.regenerateSlug === true) {
      const base = String(next.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      next.slug = `${base || "profil"}-${Number(next.age) || 0}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
    }

    list[idx] = next;
    await saveList(list);

    return NextResponse.json({ ok: true, profile: next });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Serverfejl" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const guard = await requireWomanSession();
  if (!guard.ok) {
    return NextResponse.json(
      { ok: false, error: guard.error },
      { status: guard.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  try {
    const id = params.id;
    const list = await loadList();
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }
    // ejer-check
    if (list[idx].userId !== guard.user.id) {
      return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
    }

    const [removed] = list.splice(idx, 1);
    await saveList(list);
    return NextResponse.json({ ok: true, removedId: removed.id });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Serverfejl" },
      { status: 500 }
    );
  }
}
