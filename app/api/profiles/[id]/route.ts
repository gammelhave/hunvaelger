// app/api/profiles/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { readProfiles, saveProfiles } from "@/lib/db-kv";
import { Profile } from "@/lib/db-kv";

/**
 * GET  - offentlig adgang (QR-link)
 * PUT  - kun profil-ejer
 * DELETE - kun profil-ejer
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const list = await readProfiles();
  const profile = list.find((p) => p.id === params.id);

  if (!profile) {
    return NextResponse.json({ ok: false, error: "Profil ikke fundet" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, profile });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ ok: false, error: "Login kræves" }, { status: 401 });
  }

  const list = await readProfiles();
  const index = list.findIndex((p) => p.id === params.id);

  if (index === -1) {
    return NextResponse.json({ ok: false, error: "Profil ikke fundet" }, { status: 404 });
  }

  const profile = list[index];
  if (profile.userId !== session.user.email) {
    return NextResponse.json({ ok: false, error: "Ingen adgang" }, { status: 403 });
  }

  const body = await req.json();
  const updated: Profile = { ...profile, ...body };
  list[index] = updated;
  await saveProfiles(list);

  return NextResponse.json({ ok: true, profile: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ ok: false, error: "Login kræves" }, { status: 401 });
  }

  const list = await readProfiles();
  const profile = list.find((p) => p.id === params.id);

  if (!profile) {
    return NextResponse.json({ ok: false, error: "Profil ikke fundet" }, { status: 404 });
  }

  if (profile.userId !== session.user.email) {
    return NextResponse.json({ ok: false, error: "Ingen adgang" }, { status: 403 });
  }

  const updatedList = list.filter((p) => p.id !== params.id);
  await saveProfiles(updatedList);

  return NextResponse.json({ ok: true, message: "Profil slettet" });
}
