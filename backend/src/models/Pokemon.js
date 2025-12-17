import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    height: Number,
    weight: Number,
    types: [String],
    stats: {
      hp: Number,
      attack: Number,
      defense: Number,
      speed: Number,
    },
    searchText: String,
  },
  { timestamps: true }
);

// Text index for full-text search
PokemonSchema.index({ searchText: "text" });

// Indexes for filtering
PokemonSchema.index({ types: 1 });
PokemonSchema.index({ "stats.attack": 1 });
PokemonSchema.index({ "stats.defense": 1 });
PokemonSchema.index({ "stats.hp": 1 });
PokemonSchema.index({ "stats.speed": 1 });

export default mongoose.model("Pokemon", PokemonSchema);