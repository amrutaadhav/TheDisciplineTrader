const mongoose = require('mongoose');

const capitalSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  startingAmount: { type: Number, default: 10000 },
  liquidAmount:   { type: Number, default: 10000 },
  bufferAmount:   { type: Number, default: 1500 },
  withdrawAmount: { type: Number, default: 0 },
  growthAmount:   { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Capital', capitalSchema);
