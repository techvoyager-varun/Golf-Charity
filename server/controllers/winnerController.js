const Winner = require('../models/Winner');

exports.submitProof = async (req, res, next) => {
  try {
    const { winnerId, proofImageUrl } = req.body;
    const winner = await Winner.findOne({ _id: winnerId, userId: req.user._id });
    if (!winner) return res.status(404).json({ success: false, message: 'Winner record not found', code: 'NOT_FOUND' });
    winner.proofImageUrl = proofImageUrl;
    winner.submittedAt = new Date();
    await winner.save();
    res.json({ success: true, data: winner });
  } catch (error) { next(error); }
};

exports.getMyWinnings = async (req, res, next) => {
  try {
    const winnings = await Winner.find({ userId: req.user._id }).populate('drawId').sort({ createdAt: -1 });
    res.json({ success: true, data: winnings });
  } catch (error) { next(error); }
};

exports.getAllWinners = async (req, res, next) => {
  try {
    const winners = await Winner.find().populate('userId', 'name email').populate('drawId').sort({ createdAt: -1 });
    res.json({ success: true, data: winners });
  } catch (error) { next(error); }
};

exports.approveWinner = async (req, res, next) => {
  try {
    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found', code: 'NOT_FOUND' });
    winner.status = 'approved';
    winner.reviewedAt = new Date();
    winner.adminNotes = req.body.adminNotes || '';
    await winner.save();
    res.json({ success: true, data: winner });
  } catch (error) { next(error); }
};

exports.rejectWinner = async (req, res, next) => {
  try {
    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found', code: 'NOT_FOUND' });
    winner.status = 'rejected';
    winner.reviewedAt = new Date();
    winner.adminNotes = req.body.adminNotes || '';
    await winner.save();
    res.json({ success: true, data: winner });
  } catch (error) { next(error); }
};

exports.markPaid = async (req, res, next) => {
  try {
    const winner = await Winner.findById(req.params.id);
    if (!winner) return res.status(404).json({ success: false, message: 'Winner not found', code: 'NOT_FOUND' });
    if (winner.status !== 'approved') return res.status(400).json({ success: false, message: 'Winner must be approved first', code: 'NOT_APPROVED' });
    winner.status = 'paid';
    winner.paidAt = new Date();
    await winner.save();
    res.json({ success: true, data: winner });
  } catch (error) { next(error); }
};
