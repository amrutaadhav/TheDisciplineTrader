const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/authRoutes'));
app.use('/api/trades',  require('./routes/tradeRoutes'));
app.use('/api/capital', require('./routes/capitalRoutes'));
app.use('/api/routine', require('./routes/routineRoutes'));
app.use('/api/videos',  require('./routes/videoRoutes'));
app.use('/api/streak',  require('./routes/streakRoutes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
