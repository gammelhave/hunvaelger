import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET() {
  try {
    const data = await kv.get<string>("profiles");
    if (!data) return NextResponse.json({ ok: false, error: "Ingen profiler fundet" });

    const arr = JSON.parse(data);
    if (!Array.isArray(arr)) return NextResponse.json({ ok: false, error: "Data er ikke et array" });

    let changed = 0;
    const updated = arr.map((p: any) => {
      if (!p.id) {
        p.id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
        changed++;
      }
      return p;
    });

    await kv.set("profiles", JSON.stringify(updated));
    return NextResponse.json({ ok: true, message: `Tildelt id til ${changed} profiler` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Fejl under migrering" });
  }
}
