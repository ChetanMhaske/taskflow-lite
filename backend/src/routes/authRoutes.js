const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLoginInput } = require('../middleware/validateMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');

// POST /api/auth/login
router.post('/login', validateLoginInput, authController.login);

// GET /api/auth/me
router.get('/me', requireAuth, authController.getMe);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
