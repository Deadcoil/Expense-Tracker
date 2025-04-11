const Expense = require('../models/Expense');
const Earning = require('../models/Earning');

exports.getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const trendData = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const earnings = await Earning.find({
        user: userId,
        date: { $gte: start, $lt: end },
      });

      const expenses = await Expense.find({
        user: userId,
        date: { $gte: start, $lt: end },
      });

      const totalEarnings = earnings.reduce((acc, e) => acc + e.amount, 0);
      const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

      trendData.push({
        month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        totalEarnings,
        totalExpenses,
      });
    }

    res.status(200).json(trendData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
