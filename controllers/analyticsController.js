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


exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = new Date().getFullYear();

    const earnings = await Earning.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    let monthlyStats = Array(12).fill(null).map(() => ({ earnings: 0, expenses: 0 }));

    let totalEarnings = 0;
    let totalExpenses = 0;
    let categorySpend = {};

    earnings.forEach(e => {
      const date = new Date(e.date);
      if (date.getFullYear() === year) {
        totalEarnings += e.amount;
        monthlyStats[date.getMonth()].earnings += e.amount;
      }
    });

    expenses.forEach(e => {
      const date = new Date(e.date);
      if (date.getFullYear() === year) {
        totalExpenses += e.amount;
        monthlyStats[date.getMonth()].expenses += e.amount;

        categorySpend[e.category] = (categorySpend[e.category] || 0) + e.amount;
      }
    });

    const highestSpendingCategory = Object.entries(categorySpend).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const bestSavingMonthIndex = monthlyStats.reduce((bestIdx, month, i, arr) => {
      const currentBalance = month.earnings - month.expenses;
      const bestBalance = arr[bestIdx].earnings - arr[bestIdx].expenses;
      return currentBalance > bestBalance ? i : bestIdx;
    }, 0);

    const bestSavingMonth = new Date(2000, bestSavingMonthIndex).toLocaleString('default', { month: 'long' });

    res.status(200).json({
      totalEarnings,
      totalExpenses,
      monthlyStats,
      highestSpendingCategory,
      bestSavingMonth
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
