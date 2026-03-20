const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized', code: 'NO_TOKEN' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found', code: 'USER_NOT_FOUND' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized', code: 'INVALID_TOKEN' });
  }
};

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied', code: 'FORBIDDEN' });
    }
    next();
  };
};

const subscriptionCheck = async (req, res, next) => {
  const Subscription = require('../models/Subscription');
  if (req.user.role === 'admin') return next();
  const subscription = await Subscription.findOne({ userId: req.user._id, status: 'active' });
  if (!subscription) {
    return res.status(403).json({ success: false, message: 'Active subscription required', code: 'NO_SUBSCRIPTION' });
  }
  req.subscription = subscription;
  next();
};

module.exports = { authMiddleware, roleMiddleware, subscriptionCheck };
