// app/api/profiles/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Dummy data til demo – kan senere skiftes til database
  const profiles = [
    {
      id: "anna-01",
      name: "Anna",
      age: 27,
      city: "Aarhus",
      bio: "Kaffe, koncerter og havbad. Elsker at prøve nye køkkener.",
      interests: ["Løb", "Fotografi", "Rejser"],
      img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "maria-02",
      name: "Maria",
      age: 31,
      city: "København",
      bio: "Museer, indie-film og lange gåture. Søger grin & gode samtaler.",
      interests: ["Film", "Kunst", "Yoga"],
      img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "lea-03",
      name: "Lea",
      age: 24,
      city: "Odense",
      bio: "Studerer design. QR-romantik på cykelstier og kaffebarer.",
      interests: ["Design", "Cykling", "Gaming"],
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    },
  ];
  return NextResponse.json({ ok: true, profiles });
}
