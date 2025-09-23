export default function Page({ params }) {
  return (
    <main style={{padding:24,fontFamily:"system-ui"}}>
      Dynamic route OK — id: <b>{params?.id}</b>
    </main>
  );
}