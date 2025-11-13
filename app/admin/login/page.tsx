// app/admin/login/page.tsx

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import AdminLoginClient from './AdminLoginClient';

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
