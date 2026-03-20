const express = require('express');
const router = express.Router();
const { submitProof, getMyWinnings, getAllWinners, approveWinner, rejectWinner, markPaid } = require('../controllers/winnerController');
const { authMiddleware, roleMiddleware, subscriptionCheck } = require('../middleware/auth');

router.post('/submit-proof', authMiddleware, subscriptionCheck, submitProof);
router.get('/my-winnings', authMiddleware, getMyWinnings);
router.get('/', authMiddleware, roleMiddleware('admin'), getAllWinners);
router.put('/:id/approve', authMiddleware, roleMiddleware('admin'), approveWinner);
router.put('/:id/reject', authMiddleware, roleMiddleware('admin'), rejectWinner);
router.put('/:id/mark-paid', authMiddleware, roleMiddleware('admin'), markPaid);

module.exports = router;
