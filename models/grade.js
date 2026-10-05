const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const User = require("./user.js");
const Course = require("./course.js");

const Grade = sequelize.define("Grade", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "courses",
            key: "id"
        }
    },
    marks: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {min: 0, max: 100}
    },
    grade: {
        type: DataTypes.ENUM("A", "B", "C", "D", "F"),
        allowNull: false
    }
})

Grade.belongsTo(User, {foreignKey: "studentId", as: "student"})
Grade.belongsTo(Course, {foreignKey: "courseId", as: "course"})

module.exports = Grade