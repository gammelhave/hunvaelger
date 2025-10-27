import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-100 to-white flex flex-col items-center justify-center text-center p-8">
      {/* Midlertidigt logo */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-4xl text-pink-500">♥</span>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
          HunVælger
        </h1>
      </div>

      {/* Tagline */}
      <p className="max-w-xl text-slate-700 text-lg sm:text-xl mb-10 leading-relaxed">
        Danmarks nye platform hvor kvinder vælger — og mænd viser sig fra deres bedste side.
      </p>

      {/* CTA-knap */}
      <Link
        href="/p"
        className="bg-pink-500 text-white text-lg font-semibold px-8 py-3 rounded-full shadow-md hover:bg-pink-600 transition"
      >
        Se profiler 💫
      </Link>

      {/* Lidt luft forneden */}
      <div className="mt-24 text-sm text-slate-500 opacity-70">
        &copy; {new Date().getFullYear()} HunVælger – skabt med kærlighed ❤️
      </div>
    </main>
  );
}
