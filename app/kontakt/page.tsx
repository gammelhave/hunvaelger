export const metadata = {
  title: "Kontakt",
  description: "Kontakt HunVælger – vi svarer gerne på spørgsmål og forslag.",
}

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
        Kontakt os
      </h1>
      <p className="text-gray-700 leading-7 mb-6">
        Har du spørgsmål, feedback eller et samarbejdsforslag? Skriv endelig —
        vi vil rigtig gerne høre fra dig.
      </p>

      <div className="rounded-2xl border bg-white p-6">
        <div className="space-y-2 text-gray-800">
          <p>
            Email:{" "}
            <a
              href="mailto:kontakt@hunvaelger.dk"
              className="text-pink-600 underline hover:no-underline"
            >
              kontakt@hunvaelger.dk
            </a>
          </p>
          <p>
            Facebook/Instagram: <span className="text-gray-600">(@hunvaelger)</span>
          </p>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            alert("Tak for din besked! Vi vender tilbage hurtigst muligt.")
          }}
        >
          <input
            className="w-full rounded-xl border px-4 py-3"
            placeholder="Dit navn"
            required
          />
          <input
            className="w-full rounded-xl border px-4 py-3"
            type="email"
            placeholder="Din email"
            required
          />
          <textarea
            className="w-full rounded-xl border px-4 py-3 min-h-[140px]"
            placeholder="Din besked"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-pink-500 text-white font-medium hover:opacity-95 transition"
          >
            Send besked
          </button>
        </form>
      </div>
    </section>
  )
}
