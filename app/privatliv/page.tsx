export const metadata = {
  title: "Privatlivspolitik",
  description:
    "Læs hvordan HunVælger håndterer personoplysninger og beskytter dit privatliv.",
}

export default function PrivacyPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
        Privatlivspolitik
      </h1>

      <div className="prose prose-pink max-w-none">
        <p>
          Vi tager dit privatliv alvorligt. Her beskriver vi kort, hvilke
          oplysninger vi behandler, og hvorfor.
        </p>

        <h2>Hvilke data indsamler vi?</h2>
        <ul>
          <li>Profiloplysninger (navn/kælenavn, interesser, billed(er)).</li>
          <li>Tekniske data (enheds- og brugsmålinger til forbedring af tjenesten).</li>
          <li>Kommunikationsdata ved kontakt til support.</li>
        </ul>

        <h2>Formål og behandlingsgrundlag</h2>
        <p>
          Vi bruger data til at levere platformens funktioner, forbedre
          brugeroplevelsen og forebygge misbrug. Behandling sker på baggrund af
          dit samtykke og aftale om brug af tjenesten.
        </p>

        <h2>Opbevaring & sletning</h2>
        <p>
          Oplysninger opbevares kun så længe, det er nødvendigt til de angivne
          formål. Du kan til enhver tid anmode om sletning af din profil.
        </p>

        <h2>Tredjeparter</h2>
        <p>
          Vi kan benytte betroede underleverandører (fx hosting/analytics) med
          databehandleraftaler. Data deles ikke til markedsføring uden dit
          udtrykkelige samtykke.
        </p>

        <h2>Dine rettigheder</h2>
        <ul>
          <li>Indsigt, berigtigelse, sletning og begrænsning.</li>
          <li>Dataportabilitet og indsigelsesret.</li>
          <li>Tilbagetrækning af samtykke.</li>
        </ul>

        <h2>Kontakt</h2>
        <p>
          Spørgsmål? Skriv til{" "}
          <a href="mailto:privatliv@hunvaelger.dk">privatliv@hunvaelger.dk</a>.
        </p>
      </div>
    </section>
  )
}
