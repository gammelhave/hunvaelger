// app/admin/login/page.tsx
import { Suspense } from 'react';
import LoginForm from './LoginForm';

// Undgå at siden forsøges statisk genereret (kræves ofte for auth-sider)
export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
