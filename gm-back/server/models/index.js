const dbConfig = require('../config/dbConfig');
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
.then(()=>{
    console.log('connected..');
})
.catch(err=>{
    console.log('Error '+err);
});

// creating a local object to represent the db
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// db tables
db.developers = require('./developerModel.js')(sequelize, DataTypes);
db.games = require('./gameModel.js')(sequelize, DataTypes);
db.users = require('./userModel.js')(sequelize, DataTypes);
db.tokens = require('./tokenModel.js')(sequelize, DataTypes);

// syncing with the actual db (creating the tables if they dont exist etc.)
// force: false -> dont lose data on server restart
db.sequelize.sync({force: false})
.then(() => {
    console.log('re-sync done!');
})

// 1 to many relation
db.developers.hasMany(db.games,{
    foreignKey: 'developer_id',
    as: 'game'
});

db.games.belongsTo(db.developers, {
    foreignKey: 'developer_id',
    as: 'developer'
})


//adding FK idUser to the Game Model
// db.users.hasOne(db.games,{
//     foreignKey:'idUser'
// })


module.exports = db;