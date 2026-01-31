// PR endpoints
const express = require('express');
const prController = require('../controllers/pr.controller');

const router = express.Router();

// Health check
router.get('/health', prController.health.bind(prController));

// Fetch PR data
router.post('/fetch', prController.fetchPR.bind(prController));

module.exports = router;