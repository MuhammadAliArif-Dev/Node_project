const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js")
const User = require("./user")
const Course = require("./course")

const Enrollment = sequelize.define("Enrollment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        allowNull: true,
        defaultValue: null,
        validate: { min: 0, max: 100 }
    },
    grade: {
        type: DataTypes.ENUM("A", "B", "C", "D", "F"),
        allowNull: true,
        defaultValue: null
    }
})

Enrollment.belongsTo(User, {foreignKey: "studentId", as: "student"})
Enrollment.belongsTo(Course, {foreignKey: "courseId", as: "course"})

User.belongsToMany(Course, {
    through: Enrollment,
    as: "enrolledCourses",
    foreignKey: "studentId"
})

Course.belongsToMany(User, {
    through: Enrollment,
    as: "students",
    foreignKey: "courseId"
})

module.exports = Enrollment