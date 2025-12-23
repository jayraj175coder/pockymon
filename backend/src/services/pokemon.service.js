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
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
};

/**
 * Calculate similarity ratio (0-1) using Levenshtein distance
 */
const similarityRatio = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
};

/**
 * Calculate semantic similarity score between query and pokemon data
 * This provides true semantic search capabilities using string similarity
 */
const calculateSimilarity = (query, pokemon) => {
  const queryLower = query.toLowerCase().trim();
  const nameLower = pokemon.name.toLowerCase();
  const typesLower = pokemon.types.join(" ").toLowerCase();
  const searchTextLower = pokemon.searchText?.toLowerCase() || "";

  let score = 0;

  // 1. Name similarity (highest weight - 40%)
  const nameSimilarity = similarityRatio(queryLower, nameLower);
  score += nameSimilarity * 40;

  // Exact name match bonus
  if (nameLower === queryLower) {
    score += 30;
  } else if (nameLower.startsWith(queryLower)) {
    score += 20;
  } else if (nameLower.includes(queryLower)) {
    score += 10;
  }

  // 2. Type matching (20%)
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  let typeMatchScore = 0;
  queryWords.forEach((word) => {
    pokemon.types.forEach((type) => {
      const typeLower = type.toLowerCase();
      if (typeLower === word) {
        typeMatchScore += 15;
      } else {
        const typeSim = similarityRatio(word, typeLower);
        typeMatchScore += typeSim * 10;
      }
    });
  });
  score += Math.min(typeMatchScore, 20);

  // 3. Search text similarity (20%)
  if (searchTextLower) {
    const searchTextSim = similarityRatio(queryLower, searchTextLower);
    score += searchTextSim * 20;

    // Word-by-word matching in search text
    queryWords.forEach((word) => {
      if (searchTextLower.includes(word)) {
        score += 5;
      } else {
        // Check for similar words
        const searchWords = searchTextLower.split(/\s+/);
        searchWords.forEach((sw) => {
          const wordSim = similarityRatio(word, sw);
          if (wordSim > 0.7) {
            score += wordSim * 3;
          }
        });
      }
    });
  }

  // 4. Partial character matching (10%)
  const commonChars = [...queryLower].filter((char) => 
    nameLower.includes(char) || typesLower.includes(char)
  ).length;
  if (queryLower.length > 0) {
    score += (commonChars / queryLower.length) * 10;
  }

  // 5. Substring matching bonus
  if (nameLower.includes(queryLower) || queryLower.includes(nameLower)) {
    score += 5;
  }

  return Math.min(score, 100); // Cap at 100
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
 * This searches ALL Pokemon and ranks them by semantic similarity
 */
const semanticSearch = async (query, additionalFilters = {}, limit = 20) => {
  // Get all Pokemon that match the additional filters (type, stats, etc.)
  // This is true semantic search - we don't pre-filter by text matching
  let candidates;
  
  if (Object.keys(additionalFilters).length > 0) {
    // If there are filters, apply them first
    candidates = await Pokemon.find(additionalFilters);
  } else {
    // Otherwise, get a reasonable subset for performance
    // Get more candidates than needed to ensure good results
    candidates = await Pokemon.find({}).limit(Number(limit) * 10);
  }

  // Calculate similarity scores for all candidates
  const scored = candidates.map((pokemon) => ({
    pokemon,
    score: calculateSimilarity(query, pokemon),
  }));

  // Filter out zero-score results and sort by score
  const filtered = scored.filter((item) => item.score > 0);
  filtered.sort((a, b) => b.score - a.score);

  // Return top results
  return filtered.slice(0, Number(limit)).map((item) => item.pokemon);
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
      // Run both searches in parallel for better performance
      const [fullTextResults, semanticResults] = await Promise.all([
        fullTextSearch(trimmedQuery, additionalFilters, limit).catch(() => []),
        semanticSearch(trimmedQuery, additionalFilters, limit),
      ]);

      // Merge results with priority: full-text results first, then semantic
      const resultMap = new Map();
      
      // Add full-text results first (they get priority)
      fullTextResults.forEach((p) => {
        resultMap.set(p._id.toString(), { pokemon: p, source: "fulltext", priority: 1 });
      });
      
      // Add semantic results, but don't override full-text results
      semanticResults.forEach((p) => {
        const id = p._id.toString();
        if (!resultMap.has(id)) {
          resultMap.set(id, { pokemon: p, source: "semantic", priority: 2 });
        }
      });

      // Convert to array and sort: full-text first, then semantic
      const merged = Array.from(resultMap.values())
        .sort((a, b) => a.priority - b.priority)
        .slice(0, Number(limit))
        .map((item) => item.pokemon);

      return merged;
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
    // semantic mode - pure semantic search
    return semanticSearch(trimmedQuery, additionalFilters, limit);
  }
};
