module.exports = (sequelize, DataTypes) => {
    const Developer = sequelize.define("developer",{
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Developer;
}