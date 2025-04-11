const Activity = require('../models/Activity');
const axios = require('axios');

// Get activities for a destination
exports.getActivitiesForDestination = async (req, res) => {
  try {
    const { destination } = req.query;
    
    if (!destination) {
      return res.status(400).json({ message: 'Destination parameter is required' });
    }
    
    const activities = await Activity.find({ destinationName: destination });
    
    // If we have activities in the database, return them
    if (activities.length > 0) {
      return res.json(activities);
    }
    
    // Otherwise, try to fetch from Amadeus API
    try {
      // First, get access token
      const tokenResponse = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
        `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      const token = tokenResponse.data.access_token;
      
      // Then fetch activities
      // Note: This is a placeholder since we'd need the lat/lng for the destination
      // In a real app, you would look up the destination's coordinates
      return res.json([]);
    } catch (apiError) {
      console.error('Error fetching from Amadeus API:', apiError);
      return res.json([]);
    }
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

// Add a new activity
exports.addActivity = async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ message: 'Error adding activity', error: error.message });
  }
};

// Add multiple activities (for seeding data)
exports.addMultipleActivities = async (req, res) => {
  try {
    const { activities } = req.body;
    
    if (!activities || !Array.isArray(activities)) {
      return res.status(400).json({ message: 'Valid activities array is required' });
    }
    
    const savedActivities = await Activity.insertMany(activities);
    res.status(201).json({ message: `${savedActivities.length} activities added`, activities: savedActivities });
  } catch (error) {
    console.error('Error adding multiple activities:', error);
    res.status(500).json({ message: 'Error adding activities', error: error.message });
  }
};
