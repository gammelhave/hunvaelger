'use client';

import { useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import data from './data.json';

export default function Page({ searchParams }) {
  const id = (searchParams?.id || '').toUpperCase();
  const p = data[id];

  const url = useMemo(() => (
    typeof window !== 'undefined'
      ? `${window.location.origin}/p?id=${id}`
      : `https://hunvaelger.vercel.app/p?id=${id}`
  ), [id]);

  if (!id) {
    return (
      <main style={{padding:24,fontFamily:"system-ui"}}>
        <h1>Profil</h1>
        <p>Tilføj et ID i adressen, fx <code>/p?id=AB12</code></p>
      </main>
    );
  }

  if (!p) {
    return (
      <main style={{padding:24,fontFamily:"system-ui"}}>
        <h1>Profil ikke fundet</h1>
        <p>Ingen light-profil for ID <b>{id}</b>.</p>
        <p>Tilføj nye profiler i <code>app/p/data.json</code> på GitHub.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, background: "#FFF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ color: "#132C3A", fontWeight: 800, fontSize: 28 }}>HunVælger – Light-profil</h1>

      <div style={{ marginTop: 16, display: "grid", gap: 16, gridTemplateColumns: "1fr 280px", alignItems: "start" }}>
        <section style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,.06)" }}>
          <h2 style={{ margin: 0 }}>{p.alias} <span style={{ color: "#889" }}>({id})</span></h2>

          <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {p.interesser.map(tag => (
              <span key={tag} style={{ padding: "6px 10px", borderRadius: 999, background: "#fff", border: "1px solid #e5e7eb" }}>{tag}</span>
            ))}
          </div>

          <p style={{ marginTop: 12, color: "#444" }}>• {p.note}</p>

          <a
            href={`mailto:kontakt@hunvaelger.dk?subject=Kontaktanmodning%20(${id})`}
            style={{ display: "inline-block", marginTop: 12, background: "#132C3A", color: "#fff", padding: "10px 14px", borderRadius: 12, textDecoration: "none" }}
          >
            Send anmodning (mail)
          </a>
        </section>

        <aside style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 4px 12px rgba(0,0,0,.06)", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>QR til denne profil</div>
          <QRCodeCanvas value={url} size={220} includeMargin />
          <div style={{ marginTop: 8, fontSize: 12, color: "#666", wordBreak: "break-all" }}>{url}</div>

          <a href={`/qr?id=${id}`} style={{ display: "inline-block", marginTop: 12, textDecoration: "none", fontSize: 13 }}>
            Print QR-patches →
          </a>
        </aside>
      </div>
    </main>
  );
}
