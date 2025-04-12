const express = require('express');
const router = express.Router();
const { getMonthlyTrend, getAnalytics } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/trend', authMiddleware, getMonthlyTrend);
router.get('/', authMiddleware, getAnalytics);

module.exports = router;
