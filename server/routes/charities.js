const express = require('express');
const router = express.Router();
const { getCharities, getFeatured, getBySlug, createCharity, updateCharity, deleteCharity } = require('../controllers/charityController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.get('/', getCharities);
router.get('/featured', getFeatured);
router.get('/:slug', getBySlug);
router.post('/', authMiddleware, roleMiddleware('admin'), createCharity);
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateCharity);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCharity);

module.exports = router;
