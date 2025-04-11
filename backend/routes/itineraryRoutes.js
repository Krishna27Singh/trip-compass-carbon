
const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// Get all itineraries
router.get('/', itineraryController.getAllItineraries);

// Get itinerary by ID
router.get('/:id', itineraryController.getItineraryById);

// Create new itinerary
router.post('/', itineraryController.createItinerary);

// Update itinerary
router.put('/:id', itineraryController.updateItinerary);

// Delete itinerary
router.delete('/:id', itineraryController.deleteItinerary);

// Add activity to a day
router.post('/:itineraryId/days/:dayId/activities', itineraryController.addActivity);

// Remove activity from a day
router.delete('/:itineraryId/days/:dayId/activities/:activityId', itineraryController.removeActivity);

// Calculate carbon footprint
router.post('/:id/calculate-footprint', itineraryController.calculateCarbonFootprint);

module.exports = router;
