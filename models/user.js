const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js")

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true}
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }, 
});

module.exports = User;
