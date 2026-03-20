/**
 * Prize Calculator — handles pool calculation and distribution
 * fiveMatch: 40%, fourMatch: 35%, threeMatch: 25%
 */

const PRIZE_CONTRIBUTION_PER_SUBSCRIPTION = 15; // £15 per subscriber per month

const calculatePrizePool = (subscriberCount, carriedJackpot = 0) => {
  const totalPool = subscriberCount * PRIZE_CONTRIBUTION_PER_SUBSCRIPTION;
  return {
    totalPool,
    subscriberCount,
    breakdown: {
      fiveMatch: Math.round((totalPool * 0.40 + carriedJackpot) * 100) / 100,
      fourMatch: Math.round(totalPool * 0.35 * 100) / 100,
      threeMatch: Math.round(totalPool * 0.25 * 100) / 100,
    },
    jackpotCarriedForward: carriedJackpot,
  };
};

const distributePrizes = (winners, breakdown) => {
  const tiers = { 5: 'fiveMatch', 4: 'fourMatch', 3: 'threeMatch' };
  const tierCounts = {};

  winners.forEach(w => {
    const key = Math.min(w.matchCount, 5);
    tierCounts[key] = (tierCounts[key] || 0) + 1;
  });

  return winners.map(w => {
    const key = Math.min(w.matchCount, 5);
    const tierKey = tiers[key];
    const pool = breakdown[tierKey] || 0;
    const share = pool / (tierCounts[key] || 1);
    return { ...w, prizeAmount: Math.round(share * 100) / 100 };
  });
};

module.exports = { calculatePrizePool, distributePrizes, PRIZE_CONTRIBUTION_PER_SUBSCRIPTION };
