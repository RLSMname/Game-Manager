const express = require("express");
const cors = require("cors");

const customMiddleware = require("./routes/middleware.js");
const app = express();
const PORT = 5000;
var corsOptions = {
  origin: [
    "https://localhost:8081",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
};

// sockets

const io = require("./config/socketConfig.js");

// middleware
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routers
const gameRouter = require("./routes/gameRoutes.js");
const devRouter = require("./routes/developerRoutes.js");
const miscRouter = require("./routes/miscRoutes.js");
app.use("/api/games", gameRouter);
app.use("/api/devs", devRouter);
app.use("/api/misc", miscRouter);

// server
if (require.main === module || process.env.NODEMON_WORKER_ID) {
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
}

// random ://
const randomController = require("./controllers/randomController.js");

// const db = require('./models');
// const Game = db.games;
// setInterval(async () => {
//   const newItem = randomController.createRandomGame();
//   await Game.create(newItem);
//   io.emit('newItem', newItem);
//   console.log("CREATED ITEM: ", newItem);
// }, 2000000000000);

module.exports = app;
