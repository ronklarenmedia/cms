// Getoond voor een onbekende host, een site die niet online staat en een pagina die niet bestaat.
export default function SiteNotFound() {
  return (
    <main style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "2rem", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem" }}>Pagina niet gevonden</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>Deze pagina bestaat niet of staat nog niet online.</p>
      </div>
    </main>
  );
}
