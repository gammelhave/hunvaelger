// lib/db-kv.ts
import { kv } from "@/lib/kv";

export type Profile = {
  id: string;
  userId: string;
  name: string;
  age: number;
  bio: string;
  images?: string[];
  slug: string;
};

const KEY = "profiles";

/** Hent alle profiler */
export async function readProfiles(): Promise<Profile[]> {
  try {
    const data = await kv.get<string>(KEY);
    if (!data) return [];
    const list = JSON.parse(data);
    return Array.isArray(list) ? (list as Profile[]) : [];
  } catch (err) {
    console.error("Fejl ved readProfiles:", err);
    return [];
  }
}

/** Gem hele profil-listen */
export async function saveProfiles(list: Profile[]): Promise<void> {
  try {
    await kv.set(KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Fejl ved saveProfiles:", err);
  }
}

/** Ryd alle profiler (bruges kun i admin/clear) */
export async function clearProfilesHard(): Promise<void> {
  try {
    await kv.set(KEY, JSON.stringify([]));
  } catch (err) {
    console.error("Fejl ved clearProfilesHard:", err);
  }
}

/** Find profil via slug */
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const list = await readProfiles();
  return list.find((p) => p.slug === slug) || null;
}

/** Find profil via id */
export async function getProfileById(id: string): Promise<Profile | null> {
  const list = await readProfiles();
  return list.find((p) => p.id === id) || null;
}
