const gameController = require("../controllers/gameController.js");

const router = require("express").Router();
const verifyToken = require("./middleware.js");
// add a game
router.post("/add", verifyToken, gameController.addGame);

// get all games
router.get("/all", verifyToken, gameController.getAllGames);

// get games paged
router.get("/pages/:page", verifyToken, gameController.getGamesPagedAndSorted);

// get game by id
router.get("/:id", verifyToken, gameController.getOneGame);

// update game by id
router.put("/:id", verifyToken, gameController.updateGame);

// delete game by id
router.delete("/:id", verifyToken, gameController.deleteGame);

router.patch("/scroll", verifyToken, gameController.getGamesInBatchesForDev);
router.patch("/countGamesByDev", verifyToken, gameController.countGamesByDev);

module.exports = router;
