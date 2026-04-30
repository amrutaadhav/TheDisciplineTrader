const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();

// Security and Traffic Management Middleware
app.use(helmet()); // Protects against common web vulnerabilities
app.use(compression()); // Compresses responses to reduce bandwidth and speed up loading

// Rate Limiting: Prevents DDoS and API abuse by limiting each IP to 200 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, 
  legacyHeaders: false, 
});

app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter); // Apply rate limiter to all API routes

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
