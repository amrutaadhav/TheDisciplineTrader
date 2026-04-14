const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  entry: { type: Number, required: true },
  exit: { type: Number },
  riskReward: { type: String, required: true },
  setup: { type: String, required: true },
  notes: { type: String },
  rulesFollowed: { type: [String], default: [] },
  rulesBroken: { type: [String], default: [] },
  profitOrLoss: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
