const Earning = require('../models/Earning');

// Add a new earning
exports.addEarning = async (req, res) => {
  try {
    const { amount, source, date } = req.body;
    const userId = req.user.id;

    const newEarning = new Earning({
      user: userId,
      amount,
      source,
      date,
    });

    await newEarning.save();
    res.status(201).json({ message: 'Earning added successfully', earning: newEarning });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all earnings of logged-in user
exports.getEarnings = async (req, res) => {
  try {
    const userId = req.user.id;
    const earnings = await Earning.find({ user: userId }).sort({ date: -1 });
    res.status(200).json(earnings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all earnings for logged-in user
exports.getEarnings = async (req, res) => {
    try {
      const userId = req.user.id;
      const earnings = await Earning.find({ user: userId }).sort({ date: -1 });
      res.status(200).json(earnings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };  

  exports.getEarningsByMonth = async (req, res) => {
    try {
      const userId = req.user.id;
      const { month, year } = req.query;
  
      if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required' });
      }
  
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
  
      const earnings = await Earning.find({
        user: userId,
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });
  
      res.status(200).json(earnings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
