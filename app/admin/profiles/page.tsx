// app/admin/profiles/page.tsx
import dynamic from "next/dynamic";

// Dynamisk import af client-komponenten uden SSR
const AdminProfilesClient = dynamic(
  () => import("./AdminProfilesClient"),
  { ssr: false }
);

export default function AdminProfilesPage() {
  // Denne komponent kører kun på serveren og har ingen hooks
  return <AdminProfilesClient />;
}
