const mongoose = require('mongoose');

const prizePoolSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  totalPool: { type: Number, default: 0 },
  breakdown: {
    fiveMatch: { type: Number, default: 0 },
    fourMatch: { type: Number, default: 0 },
    threeMatch: { type: Number, default: 0 },
  },
  subscriberCount: { type: Number, default: 0 },
  jackpotCarriedForward: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('PrizePool', prizePoolSchema);
