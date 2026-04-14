const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: null },
  totalActiveDays: { type: Number, default: 0 },
  earnedBadges: { type: [String], default: [] },
  history: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Streak', streakSchema);
