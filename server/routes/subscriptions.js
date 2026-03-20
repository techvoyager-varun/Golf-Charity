const express = require('express');
const router = express.Router();
const { createSubscription, getStatus, cancelSubscription, getPlans, webhookHandler } = require('../controllers/subscriptionController');
const { authMiddleware } = require('../middleware/auth');

router.get('/plans', getPlans);
router.post('/webhook', webhookHandler);
router.post('/create', authMiddleware, createSubscription);
router.get('/status', authMiddleware, getStatus);
router.post('/cancel', authMiddleware, cancelSubscription);

module.exports = router;
