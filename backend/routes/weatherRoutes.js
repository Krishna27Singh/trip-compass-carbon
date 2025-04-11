
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get weather forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lng, days = 7 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        message: 'Latitude and longitude are required' 
      });
    }
    
    // Mock weather data (in a real app, we would use a weather API)
    const weatherConditions = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];
    const forecast = [];
    
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        tempMax: Math.floor(Math.random() * 15) + 20, // 20-35°C
        tempMin: Math.floor(Math.random() * 10) + 10, // 10-20°C
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        precipitation: Math.random() * 20, // 0-20mm
        windSpeed: Math.floor(Math.random() * 30) + 5 // 5-35 km/h
      });
    }
    
    res.status(200).json({
      location: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      forecast
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching weather data', 
      error: error.message 
    });
  }
});

module.exports = router;
