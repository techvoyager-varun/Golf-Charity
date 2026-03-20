const mongoose = require('mongoose');

const drawSchema = new mongoose.Schema({
  type: { type: String, enum: ['5-number', '4-number', '3-number'], required: true },
  drawNumbers: [{ type: Number }],
  logic: { type: String, enum: ['random', 'algorithmic'], default: 'random' },
  status: { type: String, enum: ['draft', 'simulated', 'published'], default: 'draft' },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  prizePool: { type: Number, default: 0 },
  jackpotRollover: { type: Boolean, default: false },
  winners: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchCount: Number,
    prizeAmount: Number,
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  }],
  publishedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Draw', drawSchema);
