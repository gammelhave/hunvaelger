import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";
export const dynamic = "force-dynamic";

function err(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const token = process.env.BLOB2_READ_WRITE_TOKEN;
    if (!token) return err("Manglende BLOB2_READ_WRITE_TOKEN i miljøvariablerne.", 500);

    const formData = await req.formData();

    // Fang både single og multiple uploads
    const files: File[] = [
      ...((formData.getAll("files") as File[]) || []),
    ];
    const single =
      (formData.get("file") as File | null) ??
      (formData.get("image") as File | null) ??
      (formData.get("photo") as File | null);
    if (single) files.push(single);

    if (!files.length) return err("Ingen filer modtaget (forventede 'file', 'files', 'image' eller 'photo').");

    // Validering (5 MB grænse)
    for (const f of files) {
      if (f.size > 5 * 1024 * 1024) return err("Max 5 MB pr. fil.");
    }

    // Upload direkte med File-objektet (Edge-safe)
    const uploads = await Promise.all(
      files.map(async (f) => {
        const safe = f.name?.replace(/[^a-zA-Z0-9.\-_]/g, "_") || "upload";
        const pathname = `profiles/${crypto.randomUUID()}-${safe}`;
        const blob = await put(pathname, f, {
          access: "public",
          token,
          addRandomSuffix: false,
        });
        return {
          url: blob.url,
          pathname: blob.pathname,
          size: blob.size,
          contentType: blob.contentType,
        };
      })
    );

    if (uploads.length === 1) {
      const b = uploads[0];
      return NextResponse.json({ ok: true, url: b.url, pathname: b.pathname, size: b.size, contentType: b.contentType });
    }
    return NextResponse.json({ ok: true, files: uploads });
  } catch (e: any) {
    return err(e?.message || "Ukendt serverfejl i upload-endpointet.", 500);
  }
}
