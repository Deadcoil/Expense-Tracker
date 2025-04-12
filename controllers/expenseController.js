const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date, note='', tags } = req.body;

    const userId = req.user.id;

    const newExpense = new Expense({
      user: userId,
      title,
      amount,
      category,
      description,
      date,
      note,
      tags
    });
    

    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all expenses of logged-in user
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing expense
exports.updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const updates = req.body;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: expenseId, user: req.user.id },
      updates,
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: req.user.id
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or unauthorized' });
    }

    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getExpensesByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.filterExpensesByMonth = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query; // Expect month (1-12) and year (e.g., 2025)

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month

    const filteredExpenses = await Expense.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    res.status(200).json(filteredExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchByNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const keyword = req.query.note;

    const expenses = await Expense.find({
      user: userId,
      note: { $regex: keyword, $options: 'i' }  // case-insensitive search
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Filter expenses by category, date range, and keyword
exports.filterExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, startDate, endDate, keyword } = req.query;

    const filter = { user: userId };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    const filteredExpenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(filteredExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/expenseController.js
exports.getExpensesByTag = async (req, res) => {
  try {
    const userId = req.user.id;
    const tag = req.params.tag;

    const expenses = await Expense.find({
      user: userId,
      tags: tag
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
