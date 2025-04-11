
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// GET /api/activities?destination=...
router.get('/', activityController.getActivitiesForDestination);

// POST /api/activities
router.post('/', activityController.addActivity);

// POST /api/activities/bulk
router.post('/bulk', activityController.addMultipleActivities);

module.exports = router;
