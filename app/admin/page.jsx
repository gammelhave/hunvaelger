'use client';

import { useMemo, useState } from 'react';
import dataInit from '../p/data.json';

export default function AdminPage() {
  const [data, setData] = useState(dataInit);
  const [q, setQ] = useState('');
  const [newId, setNewId] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newInteresser, setNewInteresser] = useState('');
  const [newNote, setNewNote] = useState('');

  const ids = useMemo(() => Object.keys(data).sort(), [data]);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return ids;
    return ids.filter(id => {
      const p = data[id];
      return (
        id.toLowerCase().includes(s) ||
        p.alias.toLowerCase().includes(s) ||
        p.interesser.join(' ').toLowerCase().includes(s) ||
        p.note.toLowerCase().includes(s)
      );
    });
  }, [ids, data, q]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hunvaelger.vercel.app';

  function copy(text) {
    navigator.clipboard?.writeText(text);
  }

  function addProfile(e) {
    e.preventDefault();
    const id = newId.trim().toUpperCase();
    if (!id || !newAlias.trim()) {
      alert('ID og Alias (navn) er påkrævet.');
      return;
    }
    if (data[id]) {
      if (!confirm(`ID ${id} findes allerede. Overskriv?`)) return;
    }
    const interesser = newInteresser
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const next = {
      ...data,
      [id]: {
        alias: newAlias.trim(),
        interesser,
        note: newNote.trim()
      }
    };
    setData(next);
    setNewId(''); setNewAlias(''); setNewInteresser(''); setNewNote('');
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif', background: '#FFF8F3', minHeight: '100vh' }}>
      <h1 style={{ margin: 0, color: '#132C3A' }}>HunVælger — Admin</h1>
      <p style={{ marginTop: 6, color: '#444' }}>
        Overblik, søgning, hurtige links og eksport af <code>data.json</code>. For at gøre ændringer permanente: upload den downloadede
        <code> data.json</code> til <code>app/p/data.json</code> i GitHub (Commit changes) — Vercel deployer automatisk.
      </p>

      {/* Toolbar */}
      <div style={{ marginTop: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <input
          placeholder="Søg: ID, navn, interesse, note…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: 10, borderRadius: 10, border: '1px solid #ddd' }}
        />
        <button onClick={downloadJson} style={btnStyle}>Download data.json</button>
        <a href="/p/list" style={{ ...btnStyle, textDecoration: 'none', display: 'inline-grid', placeItems: 'center' }}>Åbn /p/list</a>
      </div>

      {/* Ny profil */}
      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Tilføj/ret profil</h2>
        <form onSubmit={addProfile} style={{ display: 'grid', gap: 8 }}>
          <div style={rowStyle}>
            <label style={labelStyle}>ID</label>
            <input value={newId} onChange={e => setNewId(e.target.value)} placeholder="fx AB12" style={inputStyle}/>
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Alias (navn)</label>
            <input value={newAlias} onChange={e => setNewAlias(e.target.value)} placeholder="fx Laura" style={inputStyle}/>
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Interesser (kommasepareret)</label>
            <input value={newInteresser} onChange={e => setNewInteresser(e.target.value)} placeholder="fx Friluftsliv, Kunst, Gode samtaler" style={inputStyle}/>
          </div>
          <div style={rowStyle}>
            <label style={labelStyle}>Note</label>
            <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="fx Spørg mig om min favoritvandrerute" style={inputStyle}/>
          </div>
          <div>
            <button type="submit" style={btnPrimary}>Gem i forhåndsvisning</button>
            <span style={{ marginLeft: 10, color: '#666', fontSize: 13 }}>Husk: klik “Download data.json” og upload til GitHub for at gøre det permanent.</span>
          </div>
        </form>
      </section>

      {/* Liste */}
      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Profiler ({filtered.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Alias</th>
                <th>Interesser</th>
                <th>Note</th>
                <th>Links</th>
                <th>Kopi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(id => {
                const p = data[id];
                const profile = `${origin}/p?id=${id}`;
                const qr = `${origin}/qr?id=${id}`;
                const qra4 = `${origin}/qr/a4?id=${id}`;
                return (
                  <tr key={id}>
                    <td><code>{id}</code></td>
                    <td>{p.alias}</td>
                    <td>{p.interesser.join(', ')}</td>
                    <td>{p.note}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <a href={profile} target="_blank">/p</a>{' · '}
                      <a href={qr} target="_blank">/qr</a>{' · '}
                      <a href={qra4} target="_blank">/qr/a4</a>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button onClick={() => copy(profile)} style={btnMini}>Kopiér /p</button>{' '}
                      <button onClick={() => copy(qr)} style={btnMini}>Kopiér /qr</button>{' '}
                      <button onClick={() => copy(qra4)} style={btnMini}>Kopiér /qr/a4</button>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#777' }}>Ingen resultater.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

/* inline-styles (enkelt og driftssikkert) */
const cardStyle = { background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,.06)', marginTop: 16 };
const rowStyle = { display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', gap: 10 };
const labelStyle = { fontSize: 14, color: '#333' };
const inputStyle = { padding: 10, borderRadius: 10, border: '1px solid #ddd', width: '100%' };
const btnStyle = { padding: '10px 14px', borderRadius: 12, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' };
const btnPrimary = { padding: '10px 14px', borderRadius: 12, border: '1px solid #0f2946', background: '#132C3A', color: '#fff', cursor: 'pointer' };
const btnMini = { padding: '6px 10px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 12 };
const tableStyle = {
  width: '100%', borderCollapse: 'separate', borderSpacing: 0,
  fontSize: 14
};
