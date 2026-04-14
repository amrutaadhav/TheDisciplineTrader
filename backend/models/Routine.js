const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  studyHours: { type: Number, default: 0 },
  gym: { type: Boolean, default: false },
  dietPlan: { type: Boolean, default: false },
  sleepHours: { type: Number, default: 0 },
  dailyLearning: { type: Boolean, default: false },
  mindGames: { type: Boolean, default: false },
  meditation: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Routine', routineSchema);
