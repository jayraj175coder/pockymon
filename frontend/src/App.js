import SearchPokemon from "./components/SearchPokemon";

function App() {
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>⚡ PokéDex Search</h1>
        <p style={styles.subtitle}>
          Search and filter Pokémon with full-text and semantic search
        </p>
      </header>
      <main style={styles.main}>
        <SearchPokemon />
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    padding: "40px 20px",
    color: "white",
  },
  title: {
    fontSize: "48px",
    marginBottom: "10px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  },
  subtitle: {
    fontSize: "18px",
    opacity: 0.9,
  },
  main: {
    backgroundColor: "white",
    minHeight: "calc(100vh - 200px)",
    borderRadius: "30px 30px 0 0",
    padding: "40px 20px",
  },
};

export default App;
