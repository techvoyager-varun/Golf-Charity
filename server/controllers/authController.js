const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { welcomeEmail } = require('../utils/emailTemplates');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, selectedCharityId, charityPercentage } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered', code: 'EMAIL_EXISTS' });
    }
    const user = await User.create({
      name, email, passwordHash: password,
      selectedCharityId: selectedCharityId || undefined, charityPercentage: charityPercentage || 10,
    });
    const token = generateToken(user._id);
    try { await sendEmail(welcomeEmail(user.email, user.name)); } catch (e) { /* email optional */ }
    res.status(201).json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token } });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password', code: 'MISSING_FIELDS' });
    }
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    }
    const token = generateToken(user._id);
    res.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role, selectedCharityId: user.selectedCharityId, charityPercentage: user.charityPercentage }, token } });
  } catch (error) { next(error); }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out' });
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('selectedCharityId').populate('subscriptionId');
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, selectedCharityId, charityPercentage } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (selectedCharityId) updates.selectedCharityId = selectedCharityId;
    if (charityPercentage !== undefined) {
      if (charityPercentage < 10) return res.status(400).json({ success: false, message: 'Minimum charity percentage is 10%', code: 'MIN_CHARITY' });
      updates.charityPercentage = charityPercentage;
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};
