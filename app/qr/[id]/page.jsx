"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRPrintPage({ params }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const url = `${window.location.origin}/p/${params.id}`;
    QRCode.toDataURL(url, { margin: 1 })
      .then(setDataUrl)
      .catch(console.error);
  }, [params.id]);

  return (
    <main className="mx-auto max-w-xl p-6 print:max-w-none">
      <h1 className="mb-4 text-2xl font-bold">QR til profil: {params.id}</h1>
      <p className="mb-4 text-sm opacity-70">
        Scan koden for at åbne profilen.
      </p>
      <div className="flex items-center justify-center rounded-2xl border p-6">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="QR Code" className="w-[320px] h-[320px]" />
        ) : (
          <span>Genererer QR…</span>
        )}
      </div>
      <div className="mt-6 flex gap-3">
        <button onClick={() => window.print()} className="rounded-xl border px-4 py-2 hover:shadow">
          Print
        </button>
        <a href={`/p/${params.id}`} className="rounded-xl border px-4 py-2 hover:shadow">
          Gå til profil
        </a>
      </div>
    </main>
  );
}
