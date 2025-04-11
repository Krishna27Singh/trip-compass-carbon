
const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// GET /api/destinations/popular
router.get('/popular', destinationController.getPopularDestinations);

// GET /api/destinations/search?query=...
router.get('/search', destinationController.searchDestinations);

// POST /api/destinations
router.post('/', destinationController.addDestination);

// POST /api/destinations/bulk
router.post('/bulk', destinationController.addMultipleDestinations);

module.exports = router;
