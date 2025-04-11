
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Get activities for a destination
router.get('/destination/:destinationId', activityController.getActivitiesForDestination);

// Get activities by location coordinates
router.get('/location', activityController.getActivitiesByLocation);

// Create new activity
router.post('/', activityController.createActivity);

module.exports = router;
