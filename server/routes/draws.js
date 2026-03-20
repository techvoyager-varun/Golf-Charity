const express = require('express');
const router = express.Router();
const { getCurrentDraw, getDrawHistory, getDrawById, simulate, publish, getDrawWinners } = require('../controllers/drawController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/current', getCurrentDraw);
router.get('/history', getDrawHistory);
router.get('/:id', getDrawById);
router.get('/:id/winners', getDrawWinners);
router.post('/simulate', authMiddleware, roleMiddleware('admin'), simulate);
router.post('/publish', authMiddleware, roleMiddleware('admin'), publish);

module.exports = router;
