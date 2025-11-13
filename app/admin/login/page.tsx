import AdminLoginClient from "./AdminLoginClient";

export const metadata = {
  title: "Admin login – HunVælger",
};

export default function AdminLoginPage() {
  // Ren server-komponent der bare viser client-login
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <AdminLoginClient />
    </div>
  );
}
