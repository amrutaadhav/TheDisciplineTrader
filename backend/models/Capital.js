const mongoose = require('mongoose');

const capitalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startingAmount: { type: Number, required: true },
  currentBalance: { type: Number, default: 0 },
  liquidity: { type: Number, default: 0 },
  buffer: { type: Number, default: 0 },
  withdrawals: { type: Number, default: 0 },
  growth: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Capital', capitalSchema);
