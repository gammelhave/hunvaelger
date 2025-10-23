'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useEffect, useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function Page({ searchParams }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const id = (searchParams?.id || '').toUpperCase();

  useEffect(() => {
    let alive = true;
    fetch('/api/profiles')
      .then(r => r.json())
      .then(j => { if (alive) setData(j); })
      .catch(e => { if (alive) setErr(String(e)); });
    return () => { alive = false; };
  }, []);

  const p = data?.[id];

  const url = useMemo(() => (
    typeof window !== 'undefined'
      ? `${window.location.origin}/p?id=${id}`
      : `https://hunvaelger.vercel.app/p?id=${id}`
  ), [id]);

  if (!id) return <main style={{padding:24}}>Tilføj et ID: <code>/p?id=AB12</code></main>;
  if (!data && !err) return <main style={{padding:24}}>Henter profil…</main>;
  if (err) return <main style={{padding:24}}><h1>Kunne ikke hente data</h1><p>{err}</p></main>;
  if (!p) return <main style={{padding:24}}><h1>Profil ikke fundet</h1></main>;

  return (
    <main style={{ padding: 24 }}>
      <h1>HunVælger – Light-profil</h1>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 280px" }}>
        <section>
          <h2>{p.alias} <span style={{ color: "#889" }}>({id})</span></h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.interesser.map(tag => <span key={tag} style={{ padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 999 }}>{tag}</span>)}
          </div>
          <p style={{ marginTop: 12 }}>• {p.note}</p>
          <a href={`mailto:kontakt@hunvaelger.dk?subject=Kontaktanmodning%20(${id})`} style={{ display: "inline-block", marginTop: 12 }}>
            Send anmodning (mail)
          </a>
        </section>
        <aside style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>QR til denne profil</div>
          <QRCodeCanvas value={url} size={220} includeMargin />
          <div style={{ marginTop: 8, fontSize: 12, color: "#666", wordBreak: "break-all" }}>{url}</div>
          <a href={`/qr?id=${id}`} style={{ display: "inline-block", marginTop: 12 }}>Print QR-patches →</a>
        </aside>
      </div>
    </main>
  );
}
