const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { forwardAuth } = require('../middleware/auth');

// Register
router.get('/register', forwardAuth, authController.showRegister);
router.post('/register', authController.register);

// Login
router.get('/login', forwardAuth, authController.showLogin);
router.post('/login', authController.login);

// Forgot password (demo, chưa xử lý gửi mail)
router.get('/forgot', authController.showForgot);

// Logout
router.post('/logout', authController.logout);

module.exports = router;