import express from "express";
import { searchPokemonHandler, getTypesHandler } from "../controllers/pokemon.controller.js";

const router = express.Router();

router.get("/search", searchPokemonHandler);
router.get("/types", getTypesHandler);

export default router;
