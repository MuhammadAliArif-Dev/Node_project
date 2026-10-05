const Course = require("../models/course")
const User = require("../models/user")
const Enrollment = require("../models/enrollment")

const createCourse = async (req, res ) => {
    const {title, description, teacherId} = req.body
    try {
        const existingCourse = await Course.findOne({where: {title: title}})
        if(existingCourse){
            return res.status(409).json({
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
        const courses = await Course.findAll({
            include: [{
                model: User,
                as: "teacher",
                attributes: ["first_name", "last_name", "email"]
            }]
        })
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

const getCourseById = async (req, res) => {
    const { id } = req.params
    try{
        const course = await Course.findByPk(id, {
            include: [{
                model: User,
                as: "teacher",
                attributes: ["first_name", "last_name", "email" ]
            }]
        })
        if(!course) {
            return res.status(404).json({
                message: "Course not found"          
            })
        }
        return res.status(200).json({
            message: "Course Details",
            data: course
        })
    }catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const getCourseByTitle = async (req, res) => {
    const {title} = req.params
        try{
            const course = await Course.findOne({
                where: {title: title},
                include: [{
                    model: User,
                    as: "teacher",
                    attributes: ["first_name", "last_name", "email"]
                }]
            })
            if(!course){
                return res.status(404).json({
                    message: "No course found with this title"
                })
            }
            return res.status(200).json({
                message: "Course Detail",
                data: course
            })
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }
}

const updateCourse = async (req, res) => {
    const { id } = req.params
    const { title, description} = req.body
    try {
        const course = await Course.findByPk(id)
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        //teacher can only edit its own course
        if(req.user.role === "teacher" && course.teacherId !== req.user.id){
            return res.status(403).json({
                message: "Access Denied: You can only edit your own courses."
            })
        }
        await course.update({
            title: title || course.title,
            description: description || course.description
        })
        await course.save()
        return res.status(200).json({
            message: "Course Updated Successfully",
            data: course
        })

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const enrollInCourse = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.id;
    try {
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const alreadyEnrolled = await Enrollment.findOne({
            where: { studentId, courseId }
        });

        if (alreadyEnrolled) {
            return res.status(409).json({ message: "You are already enrolled in this course" });
        }

        const newEnrollment = await Enrollment.create({
            studentId,
            courseId
        });

        return res.status(201).json({
            message: "Successfully enrolled in course",
            data: newEnrollment
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getMyEnrolledCourses = async (req, res) => {
    try {
        const student = await User.findByPk(req.user.id, {
            attributes: ["id", "first_name", "last_name", "email"],
            include: [{
                model: Course,
                as: "enrolledCourses",
                through: { attributes: ["marks", "grade"] } 
            }]
        });

        return res.status(200).json({
            message: "My Enrolled Courses",
            data: student
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const calculateGrade = (marks) => {
    if(marks >= 85) return "A"
    if(marks >= 70) return "B"
    if(marks >= 55) return "C"
    if(marks >= 40) return "D"
    return "F"

}

const assignGrade = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.params.studentId || req.body.studentId;
    // const { grade } = req.body;
    const { marks } = req.body;
    try {
        if(marks === undefined || marks < 0 || marks > 100){
            return res.status(400).json({
                message: "Marks must be between 0 and 100"
            })
        }

        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (req.user.role === "teacher" && course.teacherId !== req.user.id) {
            return res.status(403).json({
                message: "You can only assign grades your own course."
            });
        }

        const enrollment = await Enrollment.findOne({
            where: { studentId, courseId }
        });

        if (!enrollment) {
            return res.status(404).json({
                message: "Student is not enrolled in this course."
            });
        }
        
        const autograde = calculateGrade(marks)
        enrollment.marks = marks
        enrollment.grade = autograde
        await enrollment.save();
        return res.status(200).json({
            message: `Marks ('${marks}') and Grade ('${autograde}') assigned successfully!`,
            data: enrollment
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



module.exports = {createCourse,
                getAllCourses, 
                getCourseById, 
                getCourseByTitle, 
                updateCourse, 
                enrollInCourse,
                getMyEnrolledCourses,
                assignGrade
            }