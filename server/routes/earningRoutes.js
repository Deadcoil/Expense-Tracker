const express = require('express');
const router = express.Router();
const { addEarning, getEarnings, getEarningsByMonth } = require('../controllers/earningController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, addEarning);
router.get('/all', authMiddleware, getEarnings);
router.get('/by-month', authMiddleware, getEarningsByMonth);

module.exports = router;

