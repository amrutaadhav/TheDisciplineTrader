const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  date: { type: String, required: true },
  pair: { type: String, required: true },
  entry: { type: Number, required: true },
  exit: { type: Number },
  rr: { type: String },
  setup: { type: String },
  notes: { type: String },
  rulesViolated: { type: [String], default: [] },
  pl: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Trade', tradeSchema);
