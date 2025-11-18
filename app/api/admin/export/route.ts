// app/api/admin/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Byg CSV-header
    const headers = ["id", "name", "age", "bio", "createdAt"];
    const rows: string[] = [];

    rows.push(headers.join(";")); // semikolon så det spiller fint i dansk Excel

    for (const p of profiles) {
      const id = p.id ?? "";
      const name = (p as any).name ?? "";
      const age = (p as any).age ?? "";
      const bio = (p as any).bio ?? "";
      const createdAt = p.createdAt
        ? new Date(p.createdAt).toISOString()
        : "";

      // Enkelt escaping af semikolon og nye linjer
      const safe = (value: string) =>
        `"${String(value).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;

      rows.push(
        [
          safe(id),
          safe(String(name)),
          safe(String(age)),
          safe(String(bio)),
          safe(createdAt),
        ].join(";")
      );
    }

    const csv = rows.join("\r\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="profiler.csv"`,
      },
    });
  } catch (err) {
    console.error("EXPORT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Kunne ikke eksportere profiler" },
      { status: 500 }
    );
  }
}
