const express = require('express');
const router = express.Router();
const { getMonthlyTrend } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/trend', authMiddleware, getMonthlyTrend);

module.exports = router;
