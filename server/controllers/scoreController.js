const Score = require('../models/Score');

exports.getScores = async (req, res, next) => {
  try {
    let scoreDoc = await Score.findOne({ userId: req.user._id });
    if (!scoreDoc) scoreDoc = { scores: [] };
    // Return newest first
    const sorted = [...scoreDoc.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: sorted });
  } catch (error) { next(error); }
};

exports.addScore = async (req, res, next) => {
  try {
    const { value, date } = req.body;
    if (!value || !date) return res.status(400).json({ success: false, message: 'Score value and date are required', code: 'MISSING_FIELDS' });
    if (value < 1 || value > 45) return res.status(400).json({ success: false, message: 'Score must be between 1 and 45', code: 'INVALID_SCORE' });
    if (new Date(date) > new Date()) return res.status(400).json({ success: false, message: 'Future dates are not allowed', code: 'FUTURE_DATE' });

    let scoreDoc = await Score.findOne({ userId: req.user._id });
    if (!scoreDoc) {
      scoreDoc = await Score.create({ userId: req.user._id, scores: [{ value, date }] });
    } else {
      if (scoreDoc.scores.length >= 5) {
        // Remove oldest score
        scoreDoc.scores.sort((a, b) => new Date(a.date) - new Date(b.date));
        scoreDoc.scores.shift();
      }
      scoreDoc.scores.push({ value, date });
      await scoreDoc.save();
    }
    const sorted = [...scoreDoc.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(201).json({ success: true, data: sorted });
  } catch (error) { next(error); }
};

exports.updateScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value, date } = req.body;
    if (value && (value < 1 || value > 45)) return res.status(400).json({ success: false, message: 'Score must be between 1 and 45', code: 'INVALID_SCORE' });
    if (date && new Date(date) > new Date()) return res.status(400).json({ success: false, message: 'Future dates are not allowed', code: 'FUTURE_DATE' });

    const scoreDoc = await Score.findOne({ userId: req.user._id });
    if (!scoreDoc) return res.status(404).json({ success: false, message: 'No scores found', code: 'NOT_FOUND' });

    const scoreEntry = scoreDoc.scores.id(id);
    if (!scoreEntry) return res.status(404).json({ success: false, message: 'Score not found', code: 'NOT_FOUND' });

    if (value) scoreEntry.value = value;
    if (date) scoreEntry.date = date;
    await scoreDoc.save();
    const sorted = [...scoreDoc.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: sorted });
  } catch (error) { next(error); }
};

exports.deleteScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scoreDoc = await Score.findOne({ userId: req.user._id });
    if (!scoreDoc) return res.status(404).json({ success: false, message: 'No scores found', code: 'NOT_FOUND' });

    const scoreEntry = scoreDoc.scores.id(id);
    if (!scoreEntry) return res.status(404).json({ success: false, message: 'Score not found', code: 'NOT_FOUND' });

    scoreEntry.deleteOne();
    await scoreDoc.save();
    const sorted = [...scoreDoc.scores].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ success: true, data: sorted });
  } catch (error) { next(error); }
};
