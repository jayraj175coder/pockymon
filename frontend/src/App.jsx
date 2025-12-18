import SearchPokemon from "./components/SearchPokemon.jsx";

function App() {
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ PokéDex</h1>
        <p style={styles.subtitle}>
          Search and filter Pokémon with fast & smart search
        </p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <SearchPokemon />
        </div>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #ffcb05, #3b4cca)",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    textAlign: "center",
    padding: "60px 20px 40px",
    color: "#fff",
  },

  title: {
    fontSize: "3.5rem",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "10px",
    textShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },

  subtitle: {
    fontSize: "1.1rem",
    opacity: 0.95,
    maxWidth: "600px",
    margin: "0 auto",
  },

  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "0 20px 60px",
  },

  card: {
    width: "100%",
    maxWidth: "1200px",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  },
};

export default App;
