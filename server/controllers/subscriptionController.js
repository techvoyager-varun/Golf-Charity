const Subscription = require('../models/Subscription');
const User = require('../models/User');

exports.createSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan', code: 'INVALID_PLAN' });
    }
    // Check for existing active subscription
    const existing = await Subscription.findOne({ userId: req.user._id, status: 'active' });
    if (existing) return res.status(400).json({ success: false, message: 'Already have an active subscription', code: 'ALREADY_SUBSCRIBED' });

    const now = new Date();
    const endDate = new Date(now);
    if (plan === 'monthly') endDate.setMonth(endDate.getMonth() + 1);
    else endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription = await Subscription.create({
      userId: req.user._id, plan, status: 'active',
      currentPeriodStart: now, currentPeriodEnd: endDate, renewalDate: endDate,
    });

    await User.findByIdAndUpdate(req.user._id, { role: 'subscriber', subscriptionId: subscription._id });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) { next(error); }
};

exports.getStatus = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: subscription });
  } catch (error) { next(error); }
};

exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id, status: 'active' });
    if (!subscription) return res.status(404).json({ success: false, message: 'No active subscription found', code: 'NOT_FOUND' });
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();
    res.json({ success: true, data: subscription });
  } catch (error) { next(error); }
};

exports.getPlans = async (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'monthly', name: 'Monthly Plan', price: 29.99, interval: 'month', features: ['Monthly draw entry', 'Score tracking (5 scores)', 'Charity contribution (min 10%)', 'Winner prize pool', 'Community access'] },
      { id: 'yearly', name: 'Yearly Plan', price: 299.99, interval: 'year', savings: 59.89, features: ['All Monthly features', '2 months free', 'Priority support', 'Annual charity gala invite', 'Exclusive member events'] },
    ],
  });
};

exports.webhookHandler = async (req, res) => {
  // Stripe webhook handler placeholder
  res.json({ received: true });
};
