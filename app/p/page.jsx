import { headers } from "next/headers";
import FilterBox from "./FilterBox";
export const dynamic = "force-dynamic";

async function fetchProfiles() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const origin = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${proto}://${host}` : "");
  const res = await fetch(`${origin}/api/profiles`, { cache: "no-store" });
  if (!res.ok) throw new Error("API error");
  const json = await res.json();
  return json.data || [];
}

export default async function ProfilesPage() {
  const list = await fetchProfiles();
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-end justify-between">
        <h1 className="text-3xl font-bold">Profiler</h1>
        <a href="/" className="text-sm underline opacity-70">Forside</a>
      </header>

      <FilterBox initial={list} />
    </main>
  );
}
