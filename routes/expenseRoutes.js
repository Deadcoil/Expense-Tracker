// Add these imports if not already present
const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

// Existing routes
router.post('/add', authMiddleware, addExpense);
router.get('/all', authMiddleware, getExpenses);

// ✅ New routes
router.put('/update/:id', authMiddleware, updateExpense);
router.delete('/delete/:id', authMiddleware, deleteExpense);

module.exports = router;
