import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "edge"; // hurtig og billig

export async function POST(req: NextRequest) {
  try {
    // Hent auth token fra miljøvariabler
    const token = process.env.BLOB2_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Manglende BLOB2_READ_WRITE_TOKEN i miljøvariabler." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Ingen filer modtaget" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const blobName = `uploads/${Date.now()}-${file.name}`;

      // Upload til Vercel Blob med token
      const blob = await put(blobName, buffer, {
        access: "public",
        token, // <-- vigtig linje
      });

      uploadedUrls.push(blob.url);
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (err: any) {
    console.error("Fejl under upload:", err);
    return NextResponse.json(
      { error: "Upload fejlede", details: err.message },
      { status: 500 }
    );
  }
}
