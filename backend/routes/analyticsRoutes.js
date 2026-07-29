const express = require('express');
const router = express.Router();

const AnalyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Protected Admin-only analytics
router.get('/dashboard', protect, authorize('admin'), AnalyticsController.getDashboardMetrics);

module.exports = router;
