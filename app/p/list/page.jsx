import data from '../data.json';
export default function Page(){
  const ids = Object.keys(data).sort();
  return (
    <main style={{padding:24,fontFamily:"system-ui"}}>
      <h1>Profiler i data.json</h1>
      <ul>
        {ids.map(id => (
          <li key={id}>
            <a href={`/p?id=${id}`}>{id}</a> — {data[id].alias}
          </li>
        ))}
      </ul>
    </main>
  );
}
