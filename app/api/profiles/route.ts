// app/api/profiles/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import { readProfiles, saveProfiles } from "@/lib/db-kv";
import { Profile } from "@/lib/db-kv";

/**
 * GET = kun for admin (valgfrit)
 * POST = opret ny profil (kun for kvinder/logget ind)
 */
export async function GET() {
  try {
    const profiles = await readProfiles();
    return NextResponse.json({ ok: true, profiles });
  } catch (err) {
    console.error("Fejl i GET /api/profiles:", err);
    return NextResponse.json({ ok: false, error: "Kunne ikke hente profiler" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ ok: false, error: "Login kræves" }, { status: 401 });
  }

  // Du kan evt. tjekke om brugeren er "kvinde"
  // fx if (session.user.gender !== "female") return 403;

  try {
    const body = await req.json();
    const { name, age, bio, images, slug } = body;

    if (!name || !age || !bio) {
      return NextResponse.json({ ok: false, error: "Manglende felter" }, { status: 400 });
    }

    const list = await readProfiles();

    const newProfile: Profile = {
      id: Date.now().toString(),
      userId: session.user.email ?? "unknown",
      name,
      age,
      bio,
      images: images ?? [],
      slug: slug ?? name.toLowerCase().replace(/\s+/g, "-"),
    };

    list.push(newProfile);
    await saveProfiles(list);

    return NextResponse.json({ ok: true, profile: newProfile });
  } catch (err) {
    console.error("Fejl i POST /api/profiles:", err);
    return NextResponse.json({ ok: false, error: "Kunne ikke oprette profil" }, { status: 500 });
  }
}
