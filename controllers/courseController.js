const Course = require("../models/course")

const createCourse = async (req, res ) => {
    const {title, description, teacherId} = req.body
    try {
        const existingCourse = await Course.findOne({where: {title: title}})
        if(existingCourse){
            return res.status(400).json({
                message: "Course already exists"
            })
        }
        const newCourse = await Course.create({
            title,
            description,
            teacherId: teacherId || req.user.id
        })
        return res.status(201).json({
            message: "Course created successfully",
            data: newCourse
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll()
        return res.status(200).json({
            message: "All Courses:-",
            data: courses
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {createCourse, getAllCourses}