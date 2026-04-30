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
app.use('/api/chat',    require('./routes/chatRoutes'));

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
    });
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    // Exit process with failure so Render knows to restart
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
