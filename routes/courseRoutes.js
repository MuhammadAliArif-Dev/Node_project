const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const authorizeRoles = require("../middleware/roleMiddleware")
const { createCourse, getAllCourses } = require("../controllers/courseController")

router.post("/create", authMiddleware, authorizeRoles("super_admin", "teacher"), createCourse)

router.get("/", authMiddleware, getAllCourses)

module.exports = router