const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes'); // Import routes

dotenv.config();

const app = express(); // ✅ Initialize app first!

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); // ✅ Now this will work

// Connect to DB and Start server
mongoose.connect(process.env.MONGO_URI, { dbName: 'expense-tracker' })
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server is running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch(err => console.log(err));