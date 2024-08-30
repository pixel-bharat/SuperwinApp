const express = require("express");
const router = express.Router();
const { getGames } = require("../controllers/gamesController");

router.get("/games", getGames);

module.exports = router;
