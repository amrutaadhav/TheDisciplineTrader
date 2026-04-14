const mongoose = require('mongoose');

const routineHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date:   { type: String, required: true }, // YYYY-MM-DD
  score:  { type: Number, default: 0 },
  tasks:  { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

routineHistorySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('RoutineHistory', routineHistorySchema);
