// app/p/page.jsx  (SERVER COMPONENT)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import PageClient from './PageClient';

export default function Page({ searchParams }) {
  // Server-komponenten må gerne eksportere dynamic/revalidate
  // og giver bare props videre til client-komponenten:
  return <PageClient searchParams={searchParams} />;
}
