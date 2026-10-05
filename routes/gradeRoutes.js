const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")
const { assignGrade, getMyGrades, getStudentGrade } = require("../controllers/gradeController")

router.post("/:courseId/assign-grade", authMiddleware, authorizeRoles("super_admin", "teacher"), assignGrade)
router.post("/:courseId/assign-grade/:studentId", authMiddleware, authorizeRoles("super_admin", "teacher"), assignGrade)

router.get("/my-grades", authMiddleware, authorizeRoles("student"), getMyGrades)

router.get("/courseid/:courseId/studentid/:studentId", authMiddleware, authorizeRoles("super_admin", "teacher"), getStudentGrade)

module.exports = router