// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password || !role) return NextResponse.json({ ok:false, error:"Mangler felter" }, { status:400 });
    if (role !== "woman" && role !== "man") return NextResponse.json({ ok:false, error:"Ugyldig rolle" }, { status:400 });
    const exists = await findUserByEmail(email);
    if (exists) return NextResponse.json({ ok:false, error:"Email er allerede i brug" }, { status:400 });
    const u = await createUser(email, password, role);
    return NextResponse.json({ ok:true, user:{ id:u.id, email:u.email, role:u.role } });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e?.message || "Serverfejl" }, { status:500 });
  }
}
