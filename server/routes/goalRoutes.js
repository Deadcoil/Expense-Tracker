const express = require('express');
const router = express.Router();
const { setMonthlyGoal, getGoalProgress } = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

// Set or update monthly goal
router.post('/set', authMiddleware, setMonthlyGoal);

// Get goal progress and smart tip
router.get('/progress/:month', authMiddleware, getGoalProgress);

module.exports = router;
