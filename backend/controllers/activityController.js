
const Activity = require('../models/Activity');
const axios = require('axios');
const Destination = require('../models/Destination');

// Get activities for a destination
exports.getActivitiesForDestination = async (req, res) => {
  try {
    const { destination, lat, lng, radius = 5 } = req.query;
    
    console.log('Activity request params:', { destination, lat, lng, radius });
    
    if (destination) {
      // Search by destination name
      const activities = await Activity.find({ 
        destinationName: { $regex: new RegExp(destination, 'i') } 
      });
      
      console.log(`Found ${activities.length} activities in database for destination: ${destination}`);
      
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
          console.log(`Found destination in DB: ${destinationDoc.name} at coordinates: ${destinationDoc.lat},${destinationDoc.lng}`);
          const activities = await fetchActivitiesFromAPI(destinationDoc.lat, destinationDoc.lng, radius);
          
          // Save activities to database for future use
          if (activities.length > 0) {
            try {
              const activitiesToSave = activities.map(activity => ({
                ...activity,
                destinationName: destination
              }));
              await Activity.insertMany(activitiesToSave);
              console.log(`Saved ${activities.length} activities to database`);
            } catch (saveError) {
              console.error('Error saving activities to database:', saveError);
            }
          }
          
          return res.json(activities);
        }
        
        console.log('Destination not found in database');
        return res.json([]);
      } catch (apiError) {
        console.error('Error fetching activities from API:', apiError);
        return res.json([]);
      }
    } else if (lat && lng) {
      // Search by coordinates
      try {
        console.log(`Fetching activities by coordinates: ${lat},${lng}`);
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
    console.log('Requesting Amadeus API token');
    const tokenResponse = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
      `grant_type=client_credentials&client_id=${process.env.AMADEUS_API_KEY}&client_secret=${process.env.AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const token = tokenResponse.data.access_token;
    console.log('Successfully obtained Amadeus API token');
    
    // Fetch activities
    console.log(`Fetching activities from Amadeus API at coordinates: ${lat},${lng}, radius: ${radius}`);
    const activitiesResponse = await axios.get(
      `https://test.api.amadeus.com/v1/shopping/activities?latitude=${lat}&longitude=${lng}&radius=${radius}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (activitiesResponse.data && activitiesResponse.data.data) {
      console.log(`Received ${activitiesResponse.data.data.length} activities from Amadeus API`);
      
      // Transform to our activity model
      return activitiesResponse.data.data.map(item => {
        // Create a valid activity object based on our model
        const formattedActivity = {
          id: item.id,
          title: item.name,
          type: mapAmadeusActivityType(item.type),
          location: {
            id: item.id,
            name: item.name,
            lat: parseFloat(item.geoCode.latitude),
            lng: parseFloat(item.geoCode.longitude),
            address: item.address?.lines?.join(', ') || ''
          },
          startTime: '09:00',
          endTime: '11:00',
          description: item.shortDescription || '',
          cost: item.price?.amount || 0,
          carbonFootprint: 0,
          weatherSensitive: isWeatherSensitive(item.type),
          destinationName: item.destination || 'Unknown'
        };
        return formattedActivity;
      });
    }
    
    console.log('No activities data in response');
    return [];
  } catch (error) {
    console.error('Error in fetchActivitiesFromAPI:', error.response?.data || error.message);
    
    // For debugging purposes
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    }
    
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
