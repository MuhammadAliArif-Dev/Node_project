const express = require("express")
const router = express.Router()
const { register } = require("../controllers/register")
const User = require("../models/user")
const { login } = require("../controllers/login")
const authMiddleware = require("../middleware/authMiddleware")
const { forgetPassword, resetPassword} = require("../controllers/passwordReset")

router.post("/register", register)

router.post("/forget-pwd", forgetPassword)

router.post("/reset-pwd/:token", resetPassword)

router.post("/login", login)

router.get("/users", async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] }
        })
        res.json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "You have access to protected route",
        currentUser: req.user
    })
})

module.exports = router
