const Activity = require('../models/Activity');
const axios = require('axios');
const Destination = require('../models/Destination');

// Get activities for a destination
exports.getActivitiesForDestination = async (req, res) => {
  try {
    const { destination, lat, lng, radius = 5 } = req.query;
    
    if (destination) {
      // Search by destination name
      const activities = await Activity.find({ destinationName: destination });
      
      // If we have activities in the database, return them
      if (activities.length > 0) {
        return res.json(activities);
      }
      
      // Otherwise, try to fetch from external API
      try {
        // First, find the destination to get coordinates
        const destinationDoc = await Destination.findOne({ 
          name: { $regex: new RegExp(destination, 'i') } 
        });
        
        if (destinationDoc) {
          const activities = await fetchActivitiesFromAPI(destinationDoc.lat, destinationDoc.lng, radius);
          return res.json(activities);
        }
        
        return res.json([]);
      } catch (apiError) {
        console.error('Error fetching activities from API:', apiError);
        return res.json([]);
      }
    } else if (lat && lng) {
      // Search by coordinates
      try {
        const activities = await fetchActivitiesFromAPI(lat, lng, radius);
        return res.json(activities);
      } catch (apiError) {
        console.error('Error fetching activities from API:', apiError);
        return res.json([]);
      }
    } else {
      return res.status(400).json({ message: 'Destination name or coordinates (lat/lng) are required' });
    }
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

// Function to fetch activities from Amadeus API
async function fetchActivitiesFromAPI(lat, lng, radius) {
  try {
    // Get access token
    const tokenResponse = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const token = tokenResponse.data.access_token;
    
    // Fetch activities
    const activitiesResponse = await axios.get(
      `https://test.api.amadeus.com/v1/shopping/activities?latitude=${lat}&longitude=${lng}&radius=${radius}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (activitiesResponse.data && activitiesResponse.data.data) {
      // Transform to our activity model
      return activitiesResponse.data.data.map(item => ({
        id: item.id,
        title: item.name,
        type: mapAmadeusActivityType(item.type),
        location: {
          id: item.id,
          name: item.name,
          lat: parseFloat(item.geoCode.latitude),
          lng: parseFloat(item.geoCode.longitude),
          address: item.address?.lines?.join(', '),
          description: item.shortDescription
        },
        startTime: '09:00',
        endTime: '11:00',
        description: item.shortDescription,
        cost: item.price?.amount,
        carbonFootprint: 0,
        weatherSensitive: isWeatherSensitive(item.type)
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error in fetchActivitiesFromAPI:', error);
    return [];
  }
}

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

// Map Amadeus activity type to our activity type
function mapAmadeusActivityType(amadeusType) {
  const typeMap = {
    SIGHTSEEING: 'sightseeing',
    MUSEUM: 'museum',
    ADVENTURE: 'outdoors',
    GASTRONOMY: 'dining',
    SHOPPING: 'shopping',
    CULTURAL: 'museum',
    ARTS_AND_CULTURE: 'museum',
    ENTERTAINMENT: 'entertainment',
    WELLNESS: 'relaxation'
  };
  
  return typeMap[amadeusType] || 'sightseeing';
}

// Determine if activity is weather sensitive
function isWeatherSensitive(activityType) {
  const weatherSensitiveTypes = [
    'SIGHTSEEING', 'ADVENTURE', 'SPORTS', 'ENTERTAINMENT'
  ];
  
  return weatherSensitiveTypes.includes(activityType);
}
