module.exports = {
  HOST: "mysql",
  USER: "root",
  PASSWORD: "bananabread420!",
  DB: "game_manager3",
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
