const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")
const { createCourse, getAllCourses, getCourseById, getCourseByTitle, updateCourse, enrollInCourse, getMyEnrolledCourses } = require("../controllers/courseController")

router.post("/create", authMiddleware, authorizeRoles("super_admin", "teacher"), createCourse)

router.get("/", authMiddleware, getAllCourses)

router.get("/my-courses", authMiddleware, authorizeRoles("student"), getMyEnrolledCourses)

router.get("/:id", authMiddleware, getCourseById)

router.get("/title/:title", authMiddleware, getCourseByTitle)

router.put("/:id", authMiddleware, authorizeRoles("super_admin", "teacher"), updateCourse)

router.post("/:courseId/enroll", authMiddleware, authorizeRoles("student"), enrollInCourse)

module.exports = router