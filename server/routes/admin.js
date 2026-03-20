const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, getAnalytics, getReports } = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.use(authMiddleware, roleMiddleware('admin'));
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);
router.get('/reports', getReports);

module.exports = router;
