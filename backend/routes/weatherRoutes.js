
const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather?lat=...&lng=...&date=...
router.get('/', weatherController.getWeatherForecast);

module.exports = router;
