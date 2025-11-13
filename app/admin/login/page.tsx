// app/admin/login/page.tsx
import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export const metadata = {
  title: "Admin login – HunVælger",
};

// Sørg for at siden ikke bliver statisk genereret
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <Suspense fallback={<div>Indlæser login…</div>}>
        <AdminLoginClient />
      </Suspense>
    </div>
  );
}
