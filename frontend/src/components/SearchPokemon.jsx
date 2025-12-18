import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/api/pokemon/search`;

const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting",
  "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
  "dragon", "dark", "steel", "fairy"
];

const getTypeColor = (type) => {
  const colors = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };
  return colors[type] || "#68A090";
};

export default function SearchPokemon() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [minAttack, setMinAttack] = useState("");
  const [maxAttack, setMaxAttack] = useState("");
  const [minDefense, setMinDefense] = useState("");
  const [maxDefense, setMaxDefense] = useState("");
  const [minHp, setMinHp] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [minSpeed, setMinSpeed] = useState("");
  const [maxSpeed, setMaxSpeed] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const [searchMode, setSearchMode] = useState("hybrid");

  const search = async () => {
    if (loading) return;
    
    setLoading(true);
    setError("");
    
    try {
      const params = {
        query: query.trim() || undefined,
        type: type || undefined,
        minAttack: minAttack || undefined,
        maxAttack: maxAttack || undefined,
        minDefense: minDefense || undefined,
        maxDefense: maxDefense || undefined,
        minHp: minHp || undefined,
        maxHp: maxHp || undefined,
        minSpeed: minSpeed || undefined,
        maxSpeed: maxSpeed || undefined,
        searchMode,
        limit: 50,
      };

      Object.keys(params).forEach((key) => {
        if (params[key] === undefined) delete params[key];
      });

      const res = await axios.get(API_URL, { params });
      setResults(res.data.data || []);
      setCount(res.data.count || res.data.data?.length || 0);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "An error occurred");
      setResults([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        search();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [query, type, minAttack, maxAttack, minDefense, maxDefense, minHp, maxHp, minSpeed, maxSpeed, searchMode]);

  const clearFilters = () => {
    setQuery("");
    setType("");
    setMinAttack("");
    setMaxAttack("");
    setMinDefense("");
    setMaxDefense("");
    setMinHp("");
    setMaxHp("");
    setMinSpeed("");
    setMaxSpeed("");
    setResults([]);
    setCount(0);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <input
            style={styles.input}
            placeholder="🔍 Search Pokémon by name or type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && search()}
          />
          <button style={styles.searchButton} onClick={search} disabled={loading}>
            {loading ? "⏳ Searching..." : "🔍 Search"}
          </button>
        </div>

        <div style={styles.filters}>
          <div style={styles.filterGroup}>
            <label>Type:</label>
            <select
              style={styles.select}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              {POKEMON_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label>Search Mode:</label>
            <select
              style={styles.select}
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value)}
            >
              <option value="hybrid">Hybrid (Full-text + Semantic)</option>
              <option value="fulltext">Full-text Only</option>
              <option value="semantic">Semantic Only</option>
            </select>
          </div>

          <button style={styles.clearButton} onClick={clearFilters}>
            🗑️ Clear Filters
          </button>
        </div>

        <div style={styles.statsFilters}>
          <div style={styles.statFilter}>
            <label>Attack:</label>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Min"
              value={minAttack}
              onChange={(e) => setMinAttack(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Max"
              value={maxAttack}
              onChange={(e) => setMaxAttack(e.target.value)}
            />
          </div>

          <div style={styles.statFilter}>
            <label>Defense:</label>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Min"
              value={minDefense}
              onChange={(e) => setMinDefense(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Max"
              value={maxDefense}
              onChange={(e) => setMaxDefense(e.target.value)}
            />
          </div>

          <div style={styles.statFilter}>
            <label>HP:</label>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Min"
              value={minHp}
              onChange={(e) => setMinHp(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Max"
              value={maxHp}
              onChange={(e) => setMaxHp(e.target.value)}
            />
          </div>

          <div style={styles.statFilter}>
            <label>Speed:</label>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Min"
              value={minSpeed}
              onChange={(e) => setMinSpeed(e.target.value)}
            />
            <span>-</span>
            <input
              type="number"
              style={styles.numberInput}
              placeholder="Max"
              value={maxSpeed}
              onChange={(e) => setMaxSpeed(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {count > 0 && (
        <div style={styles.count}>
          Found {count} Pokémon
        </div>
      )}

      <div style={styles.results}>
        {results.map((p) => (
          <div key={p._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h2>
              <div style={styles.types}>
                {p.types.map((t) => (
                  <span
                    key={t}
                    style={{
                      ...styles.typeBadge,
                      backgroundColor: getTypeColor(t),
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.stats}>
              <div style={styles.stat}>
                <span style={styles.statLabel}>⚔️ Attack:</span>
                <span style={styles.statValue}>{p.stats?.attack || 0}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>🛡️ Defense:</span>
                <span style={styles.statValue}>{p.stats?.defense || 0}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>❤️ HP:</span>
                <span style={styles.statValue}>{p.stats?.hp || 0}</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statLabel}>💨 Speed:</span>
                <span style={styles.statValue}>{p.stats?.speed || 0}</span>
              </div>
            </div>

            <div style={styles.meta}>
              <span>📏 Height: {p.height / 10}m</span>
              <span>⚖️ Weight: {p.weight / 10}kg</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && results.length === 0 && count === 0 && query && (
        <div style={styles.noResults}>
          No Pokémon found. Try a different search term or adjust your filters.
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  searchSection: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    outline: "none",
  },
  searchButton: {
    padding: "12px 24px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  filters: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "15px",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  select: {
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  clearButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  statsFilters: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  statFilter: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  numberInput: {
    width: "80px",
    padding: "6px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  count: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#666",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "12px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
  results: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    marginBottom: "15px",
  },
  cardTitle: {
    margin: "0 0 10px 0",
    fontSize: "24px",
    color: "#333",
  },
  types: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  typeBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginBottom: "15px",
  },
  stat: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#666",
  },
  statValue: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  meta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#999",
    paddingTop: "10px",
    borderTop: "1px solid #eee",
  },
  noResults: {
    textAlign: "center",
    padding: "40px",
    color: "#999",
    fontSize: "19px",
  },
};