const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes'); // Import routes
const earningRoutes = require('./routes/earningRoutes'); 
const summaryRoutes = require('./routes/summaryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();

const app = express(); 

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); 

app.use('/api/earnings', earningRoutes); // ✅ Mount route

app.use('/api', summaryRoutes);

app.use('/api/goals', goalRoutes);

app.use('/api/analytics', analyticsRoutes);

app.use('/api/analytics', require('./routes/analytics'));

app.use('/api/user', require('./routes/userRoutes'));

// Test route for root
app.get('/', (req, res) => {
    res.send('🚀 Expense Tracker API is running');
  });
  
// Connect to DB and Start server
mongoose.connect(process.env.MONGO_URI, { dbName: 'expense-tracker' })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server is running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.log(err));