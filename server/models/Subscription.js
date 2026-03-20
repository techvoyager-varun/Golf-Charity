const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['monthly', 'yearly'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'lapsed', 'pending'], default: 'pending' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  renewalDate: { type: Date },
  cancelledAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
