'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function QRBatch({ searchParams }: { searchParams: { id?: string } }) {
  const id = (searchParams?.id || 'AB12').toUpperCase();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hunvaelger.dk';
  const value = `${origin}/p/${id}`;

  const Item = ({ size, label }: { size: number; label: string }) => (
    <div style={{ border: "1px dashed #ddd", padding: 12, borderRadius: 12, background: "#fff" }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>HunVælger • {label} • {id}</div>
      <div style={{ display: "grid", placeItems: "center" }}>
        <QRCodeCanvas value={value} size={size} includeMargin />
      </div>
      <div style={{ fontSize: 10, color: "#666", marginTop: 8, textAlign: "center" }}>{value}</div>
    </div>
  );

  return (
    <main style={{ padding: 24, background: "#FFF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ color: "#132C3A", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>QR-patches til print – {id}</h1>
      <p style={{ marginBottom: 16, color: "#444" }}>Tip: Brug browserens “Print” (Ctrl+P). Laminér eller sæt i keyhanger.</p>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Item size={160} label="S" />
        <Item size={220} label="M" />
        <Item size={300} label="L" />
      </div>
    </main>
  );
}