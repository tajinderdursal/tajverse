const express = require("express");
const authenticate = require("../middleware/authenticate");
const {
    register,
    login,
    getMe,
    logout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.get("/me", authenticate, getMe);
router.post("/login", login);
router.post("/logout", authenticate, logout);
module.exports = router;