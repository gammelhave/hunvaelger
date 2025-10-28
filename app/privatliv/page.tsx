"use client"

export default function PrivacyPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
        Privatlivspolitik
      </h1>
      <p className="text-gray-700 leading-7 mb-4">
        Hos HunVælger tager vi beskyttelsen af dine personoplysninger alvorligt.
        Vi indsamler kun de oplysninger, der er nødvendige for at levere vores
        service og give dig den bedste oplevelse.
      </p>
      <p className="text-gray-700 leading-7 mb-4">
        Vi videregiver eller sælger aldrig dine data til tredjeparter uden dit
        samtykke. Du kan til enhver tid kontakte os for at få indsigt i, hvilke
        oplysninger vi har gemt om dig.
      </p>
      <p className="text-gray-700 leading-7">
        Har du spørgsmål til vores privatlivspolitik, kan du skrive til os via
        kontaktformularen på siden <a href="/kontakt" className="text-pink-600 underline">Kontakt</a>.
      </p>
    </section>
  )
}
