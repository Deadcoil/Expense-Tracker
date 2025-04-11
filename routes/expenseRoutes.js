// Add these imports if not already present
const express = require('express');
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense, getExpensesByMonth, filterExpensesByMonth, searchByNote, filterExpenses, getExpensesByTag } = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

// Existing routes
router.post('/add', authMiddleware, addExpense);
router.get('/all', authMiddleware, getExpenses);

// ✅ New routes
router.put('/update/:id', authMiddleware, updateExpense);
router.delete('/delete/:id', authMiddleware, deleteExpense);

module.exports = router;


// 👇 New route
router.get('/by-month', authMiddleware, getExpensesByMonth);
router.get('/filter', authMiddleware, filterExpenses);
router.get('/filter', authMiddleware, filterExpensesByMonth);
// GET /api/expenses/search?note=groceries
router.get('/search', authMiddleware, searchByNote);
// routes/expenseRoutes.js
router.get('/tag/:tag', authMiddleware, getExpensesByTag);


