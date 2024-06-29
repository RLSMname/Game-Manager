
module.exports = (sequelize, DataTypes) => {
    const Game = sequelize.define("game",{
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        }
    });

    return Game;
}