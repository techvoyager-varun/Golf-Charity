const express = require('express');
const router = express.Router();
const { getScores, addScore, updateScore, deleteScore } = require('../controllers/scoreController');
const { authMiddleware, subscriptionCheck } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getScores);
router.post('/', subscriptionCheck, addScore);
router.put('/:id', subscriptionCheck, updateScore);
router.delete('/:id', subscriptionCheck, deleteScore);

module.exports = router;
