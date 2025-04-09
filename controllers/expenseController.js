const Expense = require('../models/Expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;

    const userId = req.user.id;

    const newExpense = new Expense({
      user: userId,
      title,
      amount,
      category,
      description,
      date,
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
