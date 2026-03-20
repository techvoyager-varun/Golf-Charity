/**
 * Draw Engine — generates draw numbers and finds winners
 * Supports random and algorithmic (score-weighted) generation
 */

const generateDrawNumbers = (type, logic, allScores) => {
  const count = type === '5-number' ? 5 : type === '4-number' ? 4 : 3;

  if (logic === 'algorithmic' && allScores.length > 0) {
    return generateAlgorithmic(count, allScores);
  }
  return generateRandom(count);
};

const generateRandom = (count) => {
  const numbers = new Set();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

const generateAlgorithmic = (count, allScores) => {
  // Build frequency map from all subscriber scores
  const frequency = {};
  for (let i = 1; i <= 45; i++) frequency[i] = 0;

  allScores.forEach(doc => {
    doc.scores.forEach(s => {
      if (s.value >= 1 && s.value <= 45) frequency[s.value]++;
    });
  });

  // Weight by frequency — most common scores have higher chance
  const weighted = [];
  Object.entries(frequency).forEach(([num, freq]) => {
    const weight = Math.max(freq, 1); // minimum weight of 1
    for (let i = 0; i < weight; i++) weighted.push(Number(num));
  });

  const numbers = new Set();
  while (numbers.size < count) {
    const idx = Math.floor(Math.random() * weighted.length);
    numbers.add(weighted[idx]);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

const findWinners = (drawNumbers, allScores, type) => {
  const winners = [];
  const matchThreshold = type === '5-number' ? 3 : type === '4-number' ? 3 : 3;

  allScores.forEach(scoreDoc => {
    const userScoreValues = scoreDoc.scores.map(s => s.value);
    const matches = userScoreValues.filter(v => drawNumbers.includes(v));
    const matchCount = matches.length;

    if (matchCount >= matchThreshold) {
      winners.push({
        userId: scoreDoc.userId,
        matchCount,
        prizeAmount: 0, // computed later by prize calculator
        verificationStatus: 'pending',
      });
    }
  });

  return winners;
};

module.exports = { generateDrawNumbers, findWinners };
