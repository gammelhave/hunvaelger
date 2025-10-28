"use client"

export default function TilmeldPage() {
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      alert("Profil oprettet! 🙌")
      form.reset()
    } else {
      alert("Noget gik galt. Prøv igen.")
    }
  }

  return (
    <section className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
        Opret profil
      </h1>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl border bg-white p-6">
        <input className="w-full rounded-xl border px-4 py-3" name="name" placeholder="Navn" required />
        <input className="w-full rounded-xl border px-4 py-3" name="age" type="number" min="18" placeholder="Alder (valgfri)" />
        <textarea className="w-full rounded-xl border px-4 py-3 min-h-[120px]" name="bio" placeholder="Kort om dig (valgfri)" />
        <button type="submit" className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-pink-500 text-white font-medium hover:opacity-95 transition">
          Gem profil
        </button>
      </form>
    </section>
  )
}
