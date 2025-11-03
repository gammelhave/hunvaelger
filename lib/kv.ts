// lib/kv.ts
import { Redis } from "@upstash/redis";

if (!process.env.KV_REST_URL || !process.env.KV_REST_TOKEN) {
  throw new Error("KV_REST_URL og KV_REST_TOKEN mangler i miljøvariablerne.");
}

export const kv = new Redis({
  url: process.env.KV_REST_URL,
  token: process.env.KV_REST_TOKEN,
});
