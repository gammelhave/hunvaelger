'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function Page({ searchParams }) {
  const id = (searchParams?.id || 'AB12').toUpperCase();
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hunvaelger.vercel.app';
  const value = `${origin}/p?id=${id}`;

  const Card = ({ size, label }) => (
    <div style={{ border: "1px dashed #ddd", padding: 16, borderRadius: 16, background: "#fff" }}>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8, textAlign: "center" }}>
        HunVælger • {label} • {id}
      </div>
      <div style={{ display: "grid", placeItems: "center" }}>
        <QRCodeCanvas value={value} size={size} includeMargin />
      </div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 8, textAlign: "center", wordBreak: "break-all" }}>
        {value}
      </div>
    </div>
  );

  return (
    <main style={{ padding: 24, background: "#FFF8F3", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ color: "#132C3A", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
        QR-patches til print – {id}
      </h1>
      <p style={{ marginBottom: 16, color: "#444" }}>
        Tip: Brug browserens <b>Print</b> (Ctrl+P) → Margener <b>Ingen</b> • <b>Baggrundsgrafik: Til</b> • Layout <b>Portræt</b>.
      </p>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <Card size={160} label="S" />
        <Card size={220} label="M" />
        <Card size={300} label="L" />
      </div>
    </main>
  );
}
