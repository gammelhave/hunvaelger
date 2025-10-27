export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Siden blev ikke fundet</h1>
      <p className="opacity-75">Tjek URL’en, eller gå tilbage til forsiden.</p>
      <a href="/" className="inline-block rounded-xl border px-4 py-2 hover:shadow">
        Til forsiden
      </a>
    </main>
  );
}
