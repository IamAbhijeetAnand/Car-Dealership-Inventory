const express = require('express');
const router = express.Router();

const AIController = require('../controllers/aiController');

// Public or Customer AI recommendation endpoint
router.post('/recommend', AIController.getRecommendations);

module.exports = router;
