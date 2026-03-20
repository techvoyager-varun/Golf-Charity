const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Draw = require('../models/Draw');
const Charity = require('../models/Charity');
const Winner = require('../models/Winner');
const PrizePool = require('../models/PrizePool');

exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    if (role) filter.role = role;
    const users = await User.find(filter).populate('subscriptionId').populate('selectedCharityId', 'name').skip((page - 1) * limit).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(filter);
    res.json({ success: true, data: { users, total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found', code: 'NOT_FOUND' });
    await Subscription.deleteMany({ userId: req.params.id });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscribers = await Subscription.countDocuments({ status: 'active' });
    const totalCharityAmount = await Charity.aggregate([{ $group: { _id: null, total: { $sum: '$totalReceived' } } }]);
    const totalPrizeDistributed = await Winner.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$prizeAmount' } } }]);
    const recentDraws = await Draw.find({ status: 'published' }).sort({ createdAt: -1 }).limit(6);
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const currentPool = await PrizePool.findOne({ month, year });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeSubscribers,
        totalCharityAmount: totalCharityAmount[0]?.total || 0,
        totalPrizeDistributed: totalPrizeDistributed[0]?.total || 0,
        currentPrizePool: currentPool?.totalPool || 0,
        recentDraws,
      },
    });
  } catch (error) { next(error); }
};

exports.getReports = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role createdAt').populate('subscriptionId', 'plan status');
    const draws = await Draw.find().sort({ createdAt: -1 });
    const winners = await Winner.find().populate('userId', 'name email').populate('drawId', 'month year');
    const charities = await Charity.find().select('name category totalReceived');
    res.json({ success: true, data: { users, draws, winners, charities } });
  } catch (error) { next(error); }
};
