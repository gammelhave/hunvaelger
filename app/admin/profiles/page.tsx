// app/admin/profiles/page.tsx
import AdminProfilesClient from "./AdminProfilesClient";

export default function AdminProfilesPage() {
  // Server-komponenten gør ikke andet end at rende client-komponenten
  return <AdminProfilesClient />;
}
