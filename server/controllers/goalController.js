// controllers/goalController.js
const Goal = require('../models/Goal');
const Expense = require('../models/Expense');

exports.setMonthlyGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, amount } = req.body;

    if (!month || !amount) {
      return res.status(400).json({ message: 'Month and amount are required' });
    }

    const existing = await Goal.findOne({ user: userId, month });

    if (existing) {
      existing.amount = amount;
      await existing.save();
      return res.status(200).json({ message: 'Goal updated successfully', goal: existing });
    }

    const newGoal = new Goal({ user: userId, month, amount });
    await newGoal.save();
    res.status(201).json({ message: 'Goal set successfully', goal: newGoal });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGoalProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month } = req.params;

    const goal = await Goal.findOne({ user: userId, month });
    if (!goal) return res.status(404).json({ message: 'Goal not set for this month' });

    const start = new Date(`${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const expenses = await Expense.find({ user: userId, date: { $gte: start, $lt: end } });
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const percentUsed = ((totalExpenses / goal.amount) * 100).toFixed(2);

    let tip = null;
    if (percentUsed >= 90) {
      const categories = {};
      expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
      });

      const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
      tip = `You're overspending in "${topCategory[0]}". Consider reducing costs in this category.`;
    }

    res.status(200).json({
      goal: goal.amount,
      totalExpenses,
      percentUsed: `${percentUsed}%`,
      tip: tip || 'You’re within your budget. Keep going!'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
