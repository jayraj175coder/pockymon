import { searchPokemon, getAllTypes } from "../services/pokemon.service.js";

export const searchPokemonHandler = async (req, res) => {
  try {
    const data = await searchPokemon(req.query);
    res.json({ count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTypesHandler = async (req, res) => {
  try {
    const types = await getAllTypes();
    res.json({ types });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
