const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Register (hash password trước khi lưu)
router.post("/register", async(req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hash });
        await newUser.save();
        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login (so sánh password)
router.post("/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        req.session.userId = user._id;
        res.json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: "err.Login failed" });
    }
});
// Logout
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie("connect.sid"); // xóa cookie session
        res.json({ message: "Logout successful" });
    });
});
// Protected route
router.get("/profile", async(req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.session.userId).select("-password");
    res.json(user);
});
module.exports = router;