const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")
const { createCourse, getAllCourses, getCourseById, getCourseByTitle, updateCourse, enrollInCourse, getMyEnrolledCourses, assignGrade, getMyGrades } = require("../controllers/courseController")

router.post("/create", authMiddleware, authorizeRoles("super_admin", "teacher"), createCourse)

router.post("/:courseId/assign-grade", authMiddleware, authorizeRoles("super_admin", "teacher"), assignGrade)
router.post("/:courseId/assign-grade/:studentId", authMiddleware, authorizeRoles("super_admin", "teacher"), assignGrade)

router.get("/", authMiddleware, getAllCourses)

router.get("/my-courses", authMiddleware, authorizeRoles("student"), getMyEnrolledCourses)

router.get("/my-grades", authMiddleware, authorizeRoles("student"), getMyGrades)

router.get("/:id", authMiddleware, getCourseById)

router.get("/title/:title", authMiddleware, getCourseByTitle)

router.put("/:id", authMiddleware, authorizeRoles("super_admin", "teacher"), updateCourse)

router.post("/:courseId/enroll", authMiddleware, authorizeRoles("student"), enrollInCourse)

module.exports = router