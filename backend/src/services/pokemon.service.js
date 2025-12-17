import Pokemon from "../models/Pokemon.js";

/**
 * Get all unique Pokémon types from the database
 */
export const getAllTypes = async () => {
  const pokemon = await Pokemon.find({}, { types: 1 });
  const typeSet = new Set();
  pokemon.forEach((p) => {
    p.types.forEach((type) => typeSet.add(type));
  });
  return Array.from(typeSet).sort();
};

/**
 * Calculate similarity score between query and pokemon data
 * This provides semantic search capabilities
 */
const calculateSimilarity = (query, pokemon) => {
  const queryLower = query.toLowerCase();
  const nameLower = pokemon.name.toLowerCase();
  const typesLower = pokemon.types.join(" ").toLowerCase();
  const searchTextLower = pokemon.searchText?.toLowerCase() || "";

  let score = 0;

  // Exact name match gets highest score
  if (nameLower === queryLower) {
    score += 100;
  } else if (nameLower.startsWith(queryLower)) {
    score += 50;
  } else if (nameLower.includes(queryLower)) {
    score += 30;
  }

  // Type matching
  if (typesLower.includes(queryLower)) {
    score += 20;
  }

  // Fuzzy matching on search text
  const words = queryLower.split(" ");
  words.forEach((word) => {
    if (searchTextLower.includes(word)) {
      score += 10;
    }
  });

  // Levenshtein-like similarity for partial matches
  if (nameLower.length > 0 && queryLower.length > 0) {
    const commonChars = [...queryLower].filter((char) => nameLower.includes(char)).length;
    score += (commonChars / Math.max(queryLower.length, nameLower.length)) * 15;
  }

  return score;
};

/**
 * Full-text search using MongoDB text index
 */
const fullTextSearch = async (query, additionalFilters = {}, limit = 20) => {
  const filter = {
    $text: { $search: query },
    ...additionalFilters,
  };

  return Pokemon.find(filter, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(Number(limit));
};

/**
 * Semantic search using similarity scoring
 */
const semanticSearch = async (query, additionalFilters = {}, limit = 20) => {
  // First, get candidates using regex for name/type matching
  const filter = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { types: { $in: [new RegExp(query, "i")] } },
      { searchText: { $regex: query, $options: "i" } },
    ],
    ...additionalFilters,
  };

  const candidates = await Pokemon.find(filter).limit(Number(limit) * 2);

  // Calculate similarity scores and sort
  const scored = candidates.map((pokemon) => ({
    pokemon,
    score: calculateSimilarity(query, pokemon),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, Number(limit)).map((item) => item.pokemon);
};

/**
 * Main search function with hybrid full-text + semantic search
 */
export const searchPokemon = async (params) => {
  const {
    query,
    type,
    minAttack,
    maxAttack,
    minDefense,
    maxDefense,
    minHp,
    maxHp,
    minSpeed,
    maxSpeed,
    limit = 20,
    searchMode = "hybrid", // 'fulltext', 'semantic', or 'hybrid'
  } = params;

  // Build additional filters
  const additionalFilters = {};

  if (type) {
    additionalFilters.types = type;
  }

  if (minAttack) {
    additionalFilters["stats.attack"] = { $gte: Number(minAttack) };
  }

  if (maxAttack) {
    additionalFilters["stats.attack"] = {
      ...additionalFilters["stats.attack"],
      $lte: Number(maxAttack),
    };
  }

  if (minDefense) {
    additionalFilters["stats.defense"] = { $gte: Number(minDefense) };
  }

  if (maxDefense) {
    additionalFilters["stats.defense"] = {
      ...additionalFilters["stats.defense"],
      $lte: Number(maxDefense),
    };
  }

  if (minHp) {
    additionalFilters["stats.hp"] = { $gte: Number(minHp) };
  }

  if (maxHp) {
    additionalFilters["stats.hp"] = {
      ...additionalFilters["stats.hp"],
      $lte: Number(maxHp),
    };
  }

  if (minSpeed) {
    additionalFilters["stats.speed"] = { $gte: Number(minSpeed) };
  }

  if (maxSpeed) {
    additionalFilters["stats.speed"] = {
      ...additionalFilters["stats.speed"],
      $lte: Number(maxSpeed),
    };
  }

  // If no query, just return filtered results
  if (!query || query.trim() === "") {
    return Pokemon.find(additionalFilters)
      .sort({ name: 1 })
      .limit(Number(limit));
  }

  const trimmedQuery = query.trim();

  // Hybrid search: combine full-text and semantic results
  if (searchMode === "hybrid") {
    try {
      // Try full-text search first
      const fullTextResults = await fullTextSearch(trimmedQuery, additionalFilters, limit);
      
      // If we got good results, return them
      if (fullTextResults.length >= limit * 0.5) {
        return fullTextResults;
      }

      // Otherwise, supplement with semantic search
      const semanticResults = await semanticSearch(trimmedQuery, additionalFilters, limit);
      
      // Merge and deduplicate
      const resultMap = new Map();
      fullTextResults.forEach((p) => resultMap.set(p._id.toString(), p));
      semanticResults.forEach((p) => {
        if (!resultMap.has(p._id.toString())) {
          resultMap.set(p._id.toString(), p);
        }
      });

      return Array.from(resultMap.values()).slice(0, Number(limit));
    } catch (error) {
      // If text index doesn't exist, fall back to semantic search
      return semanticSearch(trimmedQuery, additionalFilters, limit);
    }
  } else if (searchMode === "fulltext") {
    try {
      return fullTextSearch(trimmedQuery, additionalFilters, limit);
    } catch (error) {
      // Fall back to semantic if text index not available
      return semanticSearch(trimmedQuery, additionalFilters, limit);
    }
  } else {
    // semantic mode
    return semanticSearch(trimmedQuery, additionalFilters, limit);
  }
};
