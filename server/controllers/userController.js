// controllers/userController.js
const Expense = require('../models/Expense');
const Earning = require('../models/Earning');
const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');

    const expenses = await Expense.find({ user: userId });
    const earnings = await Earning.find({ user: userId });

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);

    // Category frequency
    const categoryFrequency = {};
    expenses.forEach(e => {
      categoryFrequency[e.category] = (categoryFrequency[e.category] || 0) + 1;
    });

    const mostFrequentCategory = Object.entries(categoryFrequency).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max, ['', 0])[0];

    // Earning source frequency
    const sourceFrequency = {};
    earnings.forEach(e => {
      sourceFrequency[e.source] = (sourceFrequency[e.source] || 0) + 1;
    });

    const mostFrequentSource = Object.entries(sourceFrequency).reduce((max, curr) =>
      curr[1] > max[1] ? curr : max, ['', 0])[0];

    res.status(200).json({
      user,
      totalEarnings,
      totalExpenses,
      mostFrequentCategory,
      mostFrequentSource,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
