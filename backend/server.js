const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/business-plans', require('./routes/businessPlanRoutes'));
app.use('/api/rag', require('./routes/ragRoutes'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'BizMind AI API is running...', status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[BizMind] Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
