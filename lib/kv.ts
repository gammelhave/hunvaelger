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

/** Nøglen vi gemmer alle profiler under i Upstash KV */
const KEY = "profiles";

/**
 * Henter alle profiler fra Upstash KV
 */
export async function readProfiles(): Promise<Profile[]> {
  try {
    const raw = await kv.get<string>(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? (list as Profile[]) : [];
  } catch (e) {
    console.error("readProfiles error", e);
    return [];
  }
}

/**
 * Gemmer en ny liste af profiler til Upstash KV
 */
export async function saveProfiles(list: Profile[]): Promise<void> {
  await kv.set(KEY, JSON.stringify(list));
}

/**
 * Rydder hele profil-listen (bruges kun i admin/clear eller debugging)
 */
export async function clearProfilesHard(): Promise<void> {
  try {
    await kv.set(KEY, JSON.stringify([]));
    console.log("Profiles cleared");
  } catch (e) {
    console.error("clearProfilesHard error", e);
  }
}

/**
 * Finder en enkelt profil ud fra dens slug
 */
export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  const list = await readProfiles();
  return list.find((p) => p.slug === slug) || null;
}

/**
 * Finder en enkelt profil ud fra dens id
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  const list = await readProfiles();
  return list.find((p) => p.id === id) || null;
}
