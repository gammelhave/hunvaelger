'use client';

export default function Page({ searchParams }){
  const id = (searchParams?.id || '').toUpperCase();
  if(!id){
    return <main style={{padding:24,fontFamily:"system-ui"}}>
      <h1>Profil</h1>
      <p>Tilføj et ID i adressen, fx <code>/p?id=AB12</code></p>
    </main>;
  }
  return <main style={{padding:24,fontFamily:"system-ui"}}>
    Light-profil demo — ID: <b>{id}</b>
  </main>;
}