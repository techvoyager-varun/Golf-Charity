const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  drawId: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw', required: true },
  matchCount: { type: Number, required: true },
  prizeAmount: { type: Number, required: true },
  proofImageUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'paid'], default: 'pending' },
  adminNotes: { type: String },
  submittedAt: { type: Date },
  reviewedAt: { type: Date },
  paidAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Winner', winnerSchema);
