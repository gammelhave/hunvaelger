'use client';

import { useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * A4 printside til QR-patches
 * URL-eksempler:
 *  /qr/a4?id=AB12                 (standard: 9 patches á 70mm)
 *  /qr/a4?id=AB12&size=60         (60mm)
 *  /qr/a4?id=AB12&size=50&count=12 (12 patches)
 *  /qr/a4?id=AB12&label=1         (viser “HunVælger • ID • URL” under QR)
 */

export default function Page({ searchParams }) {
  const id = (searchParams?.id || 'AB12').toUpperCase();
  const sizeMm = clampInt(searchParams?.size, 50, 100) ?? 70; // QR kvadrat i mm
  const count = clampInt(searchParams?.count, 1, 30) ?? 9;
  const showLabel = (searchParams?.label ?? '1') !== '0';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hunvaelger.vercel.app';
  const profileUrl = `${origin}/p?id=${id}`;

  const px = mmToPx(sizeMm); // canvas pixel-størrelse

  // Lav en liste med "count" patches
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#FFF8F3', minHeight: '100vh' }}>
      {/* Toolbar (skjules i print) */}
      <div className="toolbar">
        <div>
          <b>HunVælger – QR A4</b> • ID: <code>{id}</code> • Størrelse: <code>{sizeMm}mm</code> • Antal: <code>{count}</code>
        </div>
        <div className="controls">
          <a href={`/p?id=${id}`} target="_blank" rel="noreferrer">Vis profil →</a>
          <button onClick={() => window.print()}>Print</button>
        </div>
      </div>

      {/* Print-ark */}
      <div className="sheet">
        <header className="head">
          <div className="brand">
            <div className="dot" />
            <div className="word">HunVælger</div>
          </div>
          <div className="meta">
            ID: <b>{id}</b> • {profileUrl}
          </div>
        </header>

        <div className="grid">
          {items.map(i => (
            <div key={i} className="cell">
              <div className="card">
                <div className="qrWrap">
                  <QRCodeCanvas value={profileUrl} size={px} includeMargin />
                </div>
                {showLabel && (
                  <div className="label">
                    <div className="line1">HunVælger • ID {id}</div>
                    <div className="line2">{profileUrl}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <footer className="foot">
          Scan → åbn profil → “Hun vælger”
        </footer>
      </div>

      {/* Styles (mm for præcis print, skjul toolbar ved print) */}
      <style jsx>{`
        :root { --gap-mm: 6mm; --cell-pad: 4mm; }

        .toolbar {
          position: sticky; top: 0; z-index: 10;
          display: flex; justify-content: space-between; align-items: center;
          gap: 12px; padding: 12px 16px; background: #fff; border-bottom: 1px solid #eee;
        }
        .toolbar .controls { display: flex; gap: 8px; }
        .toolbar a { text-decoration: none; font-size: 14px; }
        .toolbar button {
          padding: 6px 10px; border-radius: 10px; border: 1px solid #ddd; background: #132C3A; color: #fff; cursor: pointer;
        }

        .sheet {
          box-sizing: border-box;
          width: 210mm; min-height: 297mm; margin: 16px auto; padding: 10mm;
          background: #fff; color: #111; box-shadow: 0 2px 16px rgba(0,0,0,.08);
        }
        .head, .foot {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 10pt; color: #666; margin-bottom: var(--gap-mm);
        }
        .brand { display: flex; align-items: center; gap: 8px; font-weight: 800; color: #132C3A; }
        .brand .dot { width: 10px; height: 10px; border-radius: 50%; background: #D83A2E; }
        .brand .word { letter-spacing: .2px; }

        .grid {
          display: grid; gap: var(--gap-mm);
          grid-template-columns: repeat(3, 1fr);
        }

        .cell {
          border: 0.4mm dashed #e4e4e4; border-radius: 3mm;
          padding: var(--cell-pad); background: #fff;
        }

        .card { display: grid; gap: 3mm; justify-items: center; }
        .qrWrap { display: grid; place-items: center; }

        .label { text-align: center; max-width: 100%; }
        .label .line1 { font-size: 10pt; color: #222; }
        .label .line2 { font-size: 8pt; color: #666; word-break: break-all; }

        @media print {
          @page { size: A4; margin: 0; }
          body { background: #fff !important; }
          .toolbar { display: none; }
          .sheet {
            margin: 0; box-shadow: none; padding: 10mm; min-height: auto;
          }
          .cell { break-inside: avoid; }
        }
      `}</style>
    </main>
  );
}

// helpers
function mmToPx(mm) { return Math.round((mm / 25.4) * 96); } // 96dpi ≈ 3.78px/mm
function clampInt(v, min, max) {
  if (v === undefined) return undefined;
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return undefined;
  return Math.max(min, Math.min(max, n));
}
