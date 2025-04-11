
const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Get all destinations
router.get('/', destinationController.getAllDestinations);

// Search destinations
router.get('/search', destinationController.searchDestinations);

// Get destination by ID
router.get('/:id', destinationController.getDestinationById);

// Create new destination
router.post('/', destinationController.createDestination);

// Seed destinations (development only)
router.post('/seed', destinationController.seedDestinations);

module.exports = router;
