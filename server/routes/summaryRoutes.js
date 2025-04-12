const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getMonthlySummary } = require('../controllers/summaryController');

router.get('/summary/:year/:month', authMiddleware, getMonthlySummary);

module.exports = router;
