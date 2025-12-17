import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Pokemon from "../models/Pokemon.js";

const fetchAndStorePokemon = async () => {
  try {
    await connectDB();
    console.log("🗑️  Clearing existing Pokémon data...");
    await Pokemon.deleteMany();

    // First, get the total count of Pokémon
    const initialResponse = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1");
    const totalCount = initialResponse.data.count;
    console.log(`📊 Total Pokémon available: ${totalCount}`);

    // Fetch all Pokémon in batches
    const list = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${totalCount}`
    );

    console.log(`📥 Fetching details for ${list.data.results.length} Pokémon...`);
    let successCount = 0;
    let errorCount = 0;

    // Process in batches to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < list.data.results.length; i += batchSize) {
      const batch = list.data.results.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (item) => {
          try {
            const detail = await axios.get(item.url);
            const p = detail.data;

            const pokemon = {
              name: p.name,
              height: p.height,
              weight: p.weight,
              types: p.types.map((t) => t.type.name),
              stats: {
                hp: p.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
                attack: p.stats.find((s) => s.stat.name === "attack")?.base_stat || 0,
                defense: p.stats.find((s) => s.stat.name === "defense")?.base_stat || 0,
                speed: p.stats.find((s) => s.stat.name === "speed")?.base_stat || 0,
              },
              searchText: `${p.name} ${p.types.map((t) => t.type.name).join(" ")}`,
            };

            await Pokemon.create(pokemon);
            successCount++;
            if (successCount % 50 === 0) {
              console.log(`✅ Processed ${successCount}/${list.data.results.length} Pokémon...`);
            }
          } catch (error) {
            errorCount++;
            console.error(`❌ Error processing ${item.name}:`, error.message);
          }
        })
      );

      // Small delay to be respectful to the API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   Successfully inserted: ${successCount}`);
    console.log(`   Errors: ${errorCount}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
    process.exit(1);
  }
};

fetchAndStorePokemon();
