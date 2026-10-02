const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js")
const User = require("./user")

const course = sequelize.define("course", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    }
})

course.belongsTo(User, {
    foreignKey: "teacherId",
    as: "teacher"
})

module.exports = course;