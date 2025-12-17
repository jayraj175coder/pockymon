import express from "express";
import cors from "cors";
import pokemonRoutes from "./routes/pokemon.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/pokemon", pokemonRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Pokédex API Running",
    endpoints: {
      search: "GET /api/pokemon/search",
      parameters: {
        query: "Search term (name, type, etc.)",
        type: "Filter by type (e.g., fire, water)",
        minAttack: "Minimum attack stat",
        maxAttack: "Maximum attack stat",
        minDefense: "Minimum defense stat",
        maxDefense: "Maximum defense stat",
        minHp: "Minimum HP stat",
        maxHp: "Maximum HP stat",
        minSpeed: "Minimum speed stat",
        maxSpeed: "Maximum speed stat",
        limit: "Number of results (default: 20)",
        searchMode: "Search mode: 'fulltext', 'semantic', or 'hybrid' (default: 'hybrid')",
      },
    },
  });
});

export default app;
