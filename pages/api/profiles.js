// pages/api/profiles.js
// Enkel in-memory store (nulstilles ved kold start / ny deployment)
import { profiles as seed } from "../../data/profiles";

let store = [...seed];

function validateProfile(p, isUpdate = false) {
  const required = ["id", "name", "age", "city"];
  if (!isUpdate) {
    for (const k of required) if (!p?.[k]) return `${k} is required`;
  }
  if (p?.age && Number.isNaN(Number(p.age))) return "age must be a number";
  return null;
}

export default function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === "GET") {
    if (id) {
      const p = store.find((x) => x.id === String(id));
      if (!p) return res.status(404).json({ ok: false, error: "Not found" });
      return res.status(200).json({ ok: true, data: p });
    }
    return res.status(200).json({ ok: true, data: store });
  }

  if (method === "POST") {
    try {
      const body = JSON.parse(req.body ?? "{}");
      const error = validateProfile(body, false);
      if (error) return res.status(400).json({ ok: false, error });

      if (store.some((x) => x.id === body.id))
        return res.status(409).json({ ok: false, error: "id already exists" });

      // normaliser
      body.age = Number(body.age);
      body.interests = Array.isArray(body.interests)
        ? body.interests
        : (body.interests || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

      store.push(body);
      return res.status(201).json({ ok: true, data: body });
    } catch (e) {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  if (method === "PUT") {
    if (!id) return res.status(400).json({ ok: false, error: "id query required" });
    const idx = store.findIndex((x) => x.id === String(id));
    if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });

    try {
      const body = JSON.parse(req.body ?? "{}");
      const error = validateProfile(body, true);
      if (error) return res.status(400).json({ ok: false, error });

      const next = { ...store[idx], ...body };
      if (next.age) next.age = Number(next.age);
      if (body.interests) {
        next.interests = Array.isArray(body.interests)
          ? body.interests
          : body.interests
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
      }
      store[idx] = next;
      return res.status(200).json({ ok: true, data: next });
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid JSON" });
    }
  }

  if (method === "DELETE") {
    if (!id) return res.status(400).json({ ok: false, error: "id query required" });
    const idx = store.findIndex((x) => x.id === String(id));
    if (idx === -1) return res.status(404).json({ ok: false, error: "Not found" });
    const removed = store[idx];
    store.splice(idx, 1);
    return res.status(200).json({ ok: true, data: removed });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
