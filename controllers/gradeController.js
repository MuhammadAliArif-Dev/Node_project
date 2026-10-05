const Grade = require("../models/grade");
const Course = require("../models/course");
const User = require("../models/user");
const Enrollment = require("../models/enrollment");

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
        
        const autoGrade = calculateGrade(marks)

        let gradeRecord = await Grade.findOne({where: {studentId, courseId}})
        if(gradeRecord) {
            gradeRecord.marks = marks
            gradeRecord.grade = autoGrade
            await gradeRecord.save()
        }else {
            gradeRecord = await Grade.create({
                studentId,
                courseId,
                marks,
                grade: autoGrade
            })
        }

        return res.status(200).json({
            message: `Marks ('${marks}') and Grade ('${autoGrade}') assigned successfully!`,
            data: gradeRecord
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getMyGrades = async (req, res) => {
    try{
        const grades = await Grade.findAll({
            where: { studentId: req.user.id},
            include: [{
                model: Course,
                as: "course",
                attributes: ["id", "title"]
            }]
        })
        return res.status(200).json({
            message: "My Grades",
            data: grades
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const getStudentGrade = async (req, res) => {
    const { courseId, studentId} = req.params
    try {
        const course = await Course.findByPk(courseId)
        if(!course) {
            return res.status(404).json({message: "Course not found"})
        }
        if(req.user.role === "teacher" && course.teacherId !== req.user.id){
            return res.status(403).json({
                message: "You can only view grades of your own courses."
            })
        }
        const student = await User.findByPk(studentId)
        if(!student) {
            return res.status(404).json({message: "Student not found"})
        }
        const gradeRecord = await Grade.findOne({
            where: {courseId, studentId},
            include: [
                {
                    model: User,
                    as: "student",
                    attributes: ["id", "first_name", "last_name", "email"]
                },
                {
                    model: Course,
                    as: "course",
                    attributes: ["id", "title"]
                }
            ]
        })
        if(!gradeRecord){
            return res.status(404).json({
                message: "No grade found for this student in this course"
            })
        }
        return res.status(200).json({
            message: "Student Grade",
            data: gradeRecord
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {assignGrade,
                getMyGrades,
                getStudentGrade}