// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  // Saml alle mulige feltnavne/varianter
  const files: File[] = [
    ...((formData.getAll("file") as File[]) || []),
    ...((formData.getAll("files") as File[]) || []),
    ...((formData.getAll("image") as File[]) || []),
    ...((formData.getAll("photo") as File[]) || []),
  ];

  // Hvis ingen arrays gav noget, prøv single keys
  const single =
    (formData.get("file") as File | null) ??
    (formData.get("image") as File | null) ??
    (formData.get("photo") as File | null);

  if (single) files.push(single);

  if (!files.length) {
    return NextResponse.json({ ok: false, error: "Ingen filer modtaget" }, { status: 400 });
  }

  // (valgfrit) størrelse/typetjek
  for (const f of files) {
    if (f.size > 5 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Max 5 MB pr. fil" }, { status: 400 });
    }
  }

  // Upload alle, returnér én eller flere URLs
  const uploads = await Promise.all(
    files.map((f) => {
      const safe = f.name?.replace(/[^a-zA-Z0-9.\-_]/g, "_") || "upload";
      const pathname = `profiles/${crypto.randomUUID()}-${safe}`;
      return put(pathname, f, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        addRandomSuffix: false,
      });
    })
  );

  // Hvis der normalt kun forventes én fil, kan klienten læse uploads[0].url
  if (uploads.length === 1) {
    const b = uploads[0];
    return NextResponse.json({ ok: true, url: b.url, pathname: b.pathname, size: b.size, contentType: b.contentType });
  }

  // Ellers returnér alle
  return NextResponse.json({
    ok: true,
    files: uploads.map((b) => ({
      url: b.url,
      pathname: b.pathname,
      size: b.size,
      contentType: b.contentType,
    })),
  });
}
