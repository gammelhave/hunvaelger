
export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#FFF8F3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }}>
      <div style={{ maxWidth: 720, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ color: "#132C3A", fontSize: 42, margin: 0, fontWeight: 800 }}>HunVælger</h1>
        <p style={{ color: "#444", fontSize: 18, marginTop: 12, lineHeight: 1.5 }}>
          Dating på kvindens præmisser 💌<br/>Hun vælger – altid.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_MVP_URL || "#"}
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "12px 18px",
            borderRadius: 14,
            background: "#FF6B6B",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            boxShadow: "0 6px 16px rgba(255,107,107,.35)"
          }}
        >
          Opret profil
        </a>
      </div>
    </main>
  );
}