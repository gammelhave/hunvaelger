export default function FAQ() {
  const items = [
    {
      q: "Hvad er HunVælger?",
      a: "Et moderne datingkoncept hvor kvinder tager initiativet, og mænd viser sig fra deres bedste side – ofte via QR-koder i den virkelige verden koblet til korte, ærlige profiler.",
    },
    {
      q: "Hvordan opretter jeg en profil?",
      a: "Gå til siden “Opret profil”, udfyld navn, alder (valgfri) og en kort bio, og tryk Gem. Din profil vises derefter på siden med profiler.",
    },
    {
      q: "Er det gratis?",
      a: "Ja, den åbne demo er gratis i øjeblikket. Fremadrettet kan der komme valgfri premium-funktioner.",
    },
    {
      q: "Hvordan fungerer QR-koderne?",
      a: "Du kan møde konceptet i bybilledet via QR-klistermærker. Når du scanner, kommer du direkte til relevante profiler eller tilmeldingen.",
    },
    {
      q: "Hvordan håndterer I privatliv?",
      a: "Vi gemmer kun nødvendige oplysninger. Læs mere i vores Privatlivspolitik – og kontakt os, hvis du vil have indsigt eller slette data.",
    },
  ]

  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">FAQ</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-2xl border bg-white p-5 open:shadow-sm"
          >
            <summary className="cursor-pointer list-none text-base md:text-lg font-medium text-gray-900 flex items-center justify-between">
              <span>{item.q}</span>
              <span className="ml-4 text-pink-500 transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-gray-700">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
