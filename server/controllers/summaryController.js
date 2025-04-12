const Expense = require('../models/Expense');
const Earning = require('../models/Earning');

exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year, month } = req.params;

    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // Fetch earnings and expenses
    const earnings = await Earning.find({
      user: userId,
      date: { $gte: start, $lt: end }
    });

    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lt: end }
    });

    const totalEarnings = earnings.reduce((acc, e) => acc + e.amount, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const balance = totalEarnings - totalExpenses;

    // 🧠 Calculate category-wise breakdown
    const categoryBreakdown = {};
    expenses.forEach(expense => {
      if (categoryBreakdown[expense.category]) {
        categoryBreakdown[expense.category] += expense.amount;
      } else {
        categoryBreakdown[expense.category] = expense.amount;
      }
    });

    res.status(200).json({
      totalEarnings,
      totalExpenses,
      balance,
      categoryBreakdown,
      earnings,
      expenses
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
