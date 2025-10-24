import { profiles } from "../../data/profiles";

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (id) {
    const p = profiles.find((x) => x.id === String(id));
    if (!p) return res.status(404).json({ ok: false, error: "Not found" });
    return res.status(200).json({ ok: true, data: p });
  }

  return res.status(200).json({ ok: true, data: profiles });
}
