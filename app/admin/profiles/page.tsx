// app/admin/profiles/page.tsx

export default function AdminProfilesPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">
        TEST – Admin profiler
      </h1>
      <p className="text-sm text-gray-600">
        Denne side er 100% statisk. Ingen login-check, ingen database.
      </p>
      <p className="mt-4">
        Hvis du kan se denne tekst på <code>/admin/profiles</code>, 
        så ved vi at selve routen virker, og at problemet lå i auth-kaldet.
      </p>
    </main>
  );
}
