const { where } = require("sequelize");
const db = require("../models");
const validators = require("../utils/validations.js");
require("../");

// create main Model
const Game = db.games;
const Developer = db.developers;

// main work
//we will use req.user obtain with the
// 1. create game
const addGame = async (req, res) => {
  const user = req.user;
  const username = user.username;
  let info = {
    name: req.body.name,
    developer: req.body.developer,
    price: req.body.price,
    description: req.body.description,
    idUser: username,
  };

  // generate a proper game (switch from dev name to dev id)
  const game = await validators.generateGameFromInfo(info);

  // validate game
  if (!validators.validateGame(game)) {
    return res.status(400).json({ error: "Invalid game data" });
  }

  // create game
  const createdGame = await Game.create(game);
  res.status(200).json(createdGame);
};

// 2. get all games
// attributes: [] columns u want

const getAllGames = async (req, res) => {
  //let games = await Game.findAll({});
  const user = req.user;
  const username = user.username;
  let games = await Game.findAll({
    attributes: ["id", "name", "price", "description"], // only the fields that interest us
    include: [
      {
        model: Developer,
        attributes: ["name"], // inner join where we select only the developer name
        required: true, //
        as: "developer",
      },
    ],
  });
  res.status(200).json(games);
};

// 3. get one game by id
const getOneGame = async (req, res) => {
  let id = req.params.id;
  console.log("GET GAME id:", id);
  let game = await Game.findOne({
    attributes: ["id", "name", "price", "description"],
    include: [
      {
        model: Developer,
        attributes: ["name"], // inner join where we select only the developer name
        required: true, //
        as: "developer",
      },
    ],
    where: { id: id },
  });
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.status(200).json(game);
};

// 4. update game
const updateGame = async (req, res) => {
  let id = req.params.id;

  // info from request body
  const updatedInfo = {
    name: req.body.name,
    developer: req.body.developer,
    price: req.body.price,
    description: req.body.description,
  };
  const updatedGame = await validators.generateGameFromInfo(updatedInfo);

  // validate new info
  if (!validators.validateGame(updatedGame)) {
    return res.status(400).json({ error: "Invalid game data" });
  }

  // update game
  const game = await Game.update(updatedGame, {
    where: { id: id },
  });

  res.status(200).json(game);
};

// 5. delete game by id
const deleteGame = async (req, res) => {
  let id = req.params.id;

  await Game.destroy({
    where: {
      id: id,
    },
  });

  res.status(200).send("game deleted");
};

// 6. get paged
const getGamesPaged = async (req, res) => {
  const user = req.user;
  const username = user.username;
  const page = parseInt(req.params.page) || 1;
  const pageSize = 5;

  console.log("PAGE: ", page);

  try {
    const games = await Game.findAll({
      attributes: ["id", "name", "price", "description"],
      offset: (page - 1) * pageSize,
      limit: pageSize,
      include: [{ model: Developer, attributes: ["name"], as: "developer" }],
    });

    const totalCount = await Game.count();

    res.status(200).json({ games, totalCount });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // 7. get sorted and paged
const getGamesPagedAndSorted = async (req, res) => {
  // const end = parseInt(req.params.end);
  // const sortOrder = req.params.sortOrder;

  // console.log("END: ", end);

  // const games = await Game.findAll({
  //     attributes: ['id', 'name', 'price', 'description'],
  //     offset: 0,
  //     limit: end,
  //     include: [{ model: Developer, attributes: ['name'], as:'developer' }],
  //     order: [['price', sortOrder]]
  // });

  // res.status(200).json(games);
  try {
    const page = parseInt(req.params.page) || 1;
    const sortingOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";
    console.log("sorting order>>", sortingOrder);
    const totalCount = await Game.count();
    const games = await Game.findAll({
      attributes: ["id", "name", "price", "description"],
      offset: (page - 1) * 5,
      limit: 5,
      include: [{ model: Developer, attributes: ["name"], as: "developer" }],
      order: [["price", sortingOrder]],
    });

    res.status(200).json({ games, totalCount });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 8. infinite scroll
const getGamesInBatchesForDev = async (req, res) => {
  const user = req.user;
  const username = user.username;
  const nameDev = req.body.dev;
  const page = req.body.page;
  console.log(nameDev);
  try {
    const result = await db.sequelize.query(
      "SELECT games.id, games.name, games.price, games.description FROM games inner join developers on games.developer_id = developers.id WHERE developers.name = :nameDev  limit :limit  offset :offset",
      {
        replacements: {
          nameDev: nameDev,
          limit: 10,
          offset: (page - 1) * 10,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    console.log("result:", result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching games:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//9 count games by dev
const countGamesByDev = async (req, res) => {
  const user = req.user;
  const username = user.username;
  const nameDev = req.body.dev;
  try {
    const result = await db.sequelize.query(
      "SELECT count(*) as count FROM games inner join developers on games.developer_id = developers.id  WHERE developers.name = :nameDev  ",
      {
        replacements: { nameDev: nameDev },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    console.log(result);
    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

module.exports = {
  addGame,
  getAllGames,
  getOneGame,
  updateGame,
  deleteGame,
  getGamesInBatchesForDev,
  countGamesByDev,
  getGamesPagedAndSorted,
};
