const Draw = require('../models/Draw');
const Score = require('../models/Score');
const Winner = require('../models/Winner');
const PrizePool = require('../models/PrizePool');
const Subscription = require('../models/Subscription');
const { generateDrawNumbers, findWinners } = require('../utils/drawEngine');
const { calculatePrizePool, distributePrizes } = require('../utils/prizeCalculator');

exports.getCurrentDraw = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const draw = await Draw.findOne({ month, year }).populate('winners.userId', 'name email');
    const prizePool = await PrizePool.findOne({ month, year });
    res.json({ success: true, data: { draw, prizePool } });
  } catch (error) { next(error); }
};

exports.getDrawHistory = async (req, res, next) => {
  try {
    const draws = await Draw.find({ status: 'published' }).sort({ createdAt: -1 }).limit(12);
    res.json({ success: true, data: draws });
  } catch (error) { next(error); }
};

exports.getDrawById = async (req, res, next) => {
  try {
    const draw = await Draw.findById(req.params.id).populate('winners.userId', 'name email');
    if (!draw) return res.status(404).json({ success: false, message: 'Draw not found', code: 'NOT_FOUND' });
    res.json({ success: true, data: draw });
  } catch (error) { next(error); }
};

exports.simulate = async (req, res, next) => {
  try {
    const { type, logic } = req.body;
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    // Get all active subscribers' scores
    const activeSubscriptions = await Subscription.find({ status: 'active' });
    const subscriberIds = activeSubscriptions.map(s => s.userId);
    const allScores = await Score.find({ userId: { $in: subscriberIds } });

    // Generate draw numbers
    const drawNumbers = generateDrawNumbers(type, logic, allScores);

    // Check for carried jackpot from previous draw
    let carriedJackpot = 0;
    const previousDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    if (previousDraw && previousDraw.jackpotRollover) {
      const prevPool = await PrizePool.findOne({ month: previousDraw.month, year: previousDraw.year });
      if (prevPool && prevPool.breakdown && prevPool.breakdown.fiveMatch) {
        carriedJackpot = prevPool.breakdown.fiveMatch;
      }
    }

    // Calculate prize pool
    const prizePoolData = calculatePrizePool(subscriberIds.length, carriedJackpot);

    // Find matches
    let winners = findWinners(drawNumbers, allScores, type);
    winners = distributePrizes(winners, prizePoolData.breakdown);

    // Check for existing draft/simulated draw this month
    let draw = await Draw.findOne({ month, year, status: { $in: ['draft', 'simulated'] } });
    if (draw) {
      draw.type = type || draw.type;
      draw.logic = logic || draw.logic;
      draw.drawNumbers = drawNumbers;
      draw.status = 'simulated';
      draw.prizePool = prizePoolData.totalPool;
      draw.winners = winners;
    } else {
      draw = new Draw({ type: type || '5-number', logic: logic || 'random', drawNumbers, status: 'simulated', month, year, prizePool: prizePoolData.totalPool, winners });
    }
    await draw.save();

    // Save/update prize pool
    await PrizePool.findOneAndUpdate({ month, year }, { ...prizePoolData, month, year }, { upsert: true, new: true });

    res.json({ success: true, data: { draw, prizePool: prizePoolData } });
  } catch (error) { next(error); }
};

exports.publish = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();

    const draw = await Draw.findOne({ month, year, status: 'simulated' });
    if (!draw) return res.status(400).json({ success: false, message: 'No simulated draw found. Run simulation first.', code: 'NO_SIMULATION' });

    draw.status = 'published';
    draw.publishedAt = new Date();

    // Check for 5-number jackpot rollover
    const has5Match = draw.winners.some(w => w.matchCount === 5);
    if (!has5Match && draw.type === '5-number') {
      draw.jackpotRollover = true;
    }

    // Create winner records
    for (const w of draw.winners) {
      await Winner.create({ userId: w.userId, drawId: draw._id, matchCount: w.matchCount, prizeAmount: w.prizeAmount, status: 'pending' });
    }

    await draw.save();
    res.json({ success: true, data: draw });
  } catch (error) { next(error); }
};

exports.getDrawWinners = async (req, res, next) => {
  try {
    const winners = await Winner.find({ drawId: req.params.id }).populate('userId', 'name email');
    res.json({ success: true, data: winners });
  } catch (error) { next(error); }
};
