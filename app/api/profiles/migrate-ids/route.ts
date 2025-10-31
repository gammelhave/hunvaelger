import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Profile = { id?: string; name: string; age: number; bio: string; images?: string[] };

export async function GET() {
  try {
    let changed = 0;

    // 1) PRØV: "profiles" som JSON-array i en enkelt key
    const raw = await kv.get("profiles"); // kan være string, array eller null
    let handledSingleKey = false;

    if (raw !== null && raw !== undefined) {
      let list: Profile[] | null = null;

      if (Array.isArray(raw)) {
        // Værdien ER allerede et array (fx sat via kv.set med objekt)
        list = raw as Profile[];
      } else if (typeof raw === "string") {
        // Kun parse, hvis det ligner JSON
        const s = raw.trim();
        if (s.startsWith("[") && s.endsWith("]")) {
          try {
            list = JSON.parse(s) as Profile[];
          } catch {
            // ignore – prøv hash nedenfor
          }
        }
      } else if (typeof raw === "object") {
        // Nogle drivere kan returnere objekt – tjek om det ligner et array
        // (fx {0:{...},1:{...}}) – lav forsøg på at hente values som array
        const values = Object.values(raw as Record<string, any>);
        if (values.length && values.every((v) => typeof v === "object")) {
          list = values as Profile[];
        }
      }

      if (list && Array.isArray(list)) {
        const updated = list.map((p) => {
          if (!p.id) {
            p.id = String(Date.now()) + Math.random().toString(36).slice(2, 8);
            changed++;
          }
          return p;
        });

        // gem tilbage – som JSON-string for stabilitet
        await kv.set("profiles", JSON.stringify(updated));
        handledSingleKey = true;
      }
    }

    // 2) FALDBACK: "profiles" som hash (HSET/HGET)
    //    Hent alle felter i hashen – hvis den ikke findes eller er forkert type, returnerer Upstash typisk null/empty.
    try {
      const all = (await kv.hgetall<string>("profiles")) as Record<string, string> | null;

      if (all && Object.keys(all).length > 0) {
        for (const [id, json] of Object.entries(all)) {
          let p: Profile | null = null;
          try {
            p = JSON.parse(json) as Profile;
          } catch {
            // Hvis en værdi ikke er gyldig JSON, spring over
            continue;
          }
          if (p && !p.id) {
            p.id = id; // brug hash-feltets key som id
            changed++;
            await kv.hset("profiles", { [id]: JSON.stringify(p) });
          }
        }
      }
    } catch {
      // Ignorer WRONGTYPE osv. – så har vi i det mindste håndteret single-key formatet
    }

    if (!handledSingleKey && changed === 0) {
      return NextResponse.json({
        ok: true,
        message: "Ingen ændringer – kunne ikke finde et kendt format, eller alle havde id.",
      });
    }

    return NextResponse.json({ ok: true, message: `Tildelt id til ${changed} profiler` });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Ukendt fejl" }, { status: 500 });
  }
}
