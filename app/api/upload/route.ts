import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge"; // hurtig og billig

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Ingen filer modtaget" }, { status: 400 });
    }
    if (files.length > 3) {
      return NextResponse.json({ error: "Max 3 billeder" }, { status: 400 });
    }

    // upload hver fil til Blob
    const urls: string[] = [];
    for (const file of files) {
      const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
      const key = `profiles/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const blob = await put(key, file, {
        access: "public", // så URL kan vises direkte på /p
        contentType: file.type || "image/jpeg",
      });

      urls.push(blob.url);
    }

    return NextResponse.json({ ok: true, urls });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Upload fejl" },
      { status: 500 }
    );
  }
}
