
const Activity = require('../models/Activity');
const axios = require('axios');

// Get activities for a destination
exports.getActivitiesForDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    
    // First try to get from our database
    const dbActivities = await Activity.find({ destinationId });
    
    if (dbActivities.length > 0) {
      return res.status(200).json(dbActivities);
    }
    
    // If no activities found, return mock activities (in a real app we would fetch from external API)
    const mockActivities = getMockActivities();
    res.status(200).json(mockActivities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

// Get activities by location coordinates
exports.getActivitiesByLocation = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // In a real application, we would fetch data from external APIs here
    const mockActivities = getMockActivities();
    
    // Add random coordinates near the provided location
    const activitiesWithCoordinates = mockActivities.map(activity => {
      // Add slight variation to coordinates
      const latVariation = (Math.random() - 0.5) * 0.02;
      const lngVariation = (Math.random() - 0.5) * 0.02;
      
      return {
        ...activity,
        location: {
          ...activity.location,
          lat: parseFloat(lat) + latVariation,
          lng: parseFloat(lng) + lngVariation
        }
      };
    });
    
    res.status(200).json(activitiesWithCoordinates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities by location', error: error.message });
  }
};

// Create a new activity
exports.createActivity = async (req, res) => {
  try {
    const newActivity = new Activity(req.body);
    const savedActivity = await newActivity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ message: 'Error creating activity', error: error.message });
  }
};

// Helper function to generate mock activities
const getMockActivities = () => {
  return [
    {
      id: '1',
      title: 'City Museum Visit',
      type: 'museum',
      location: {
        name: 'City Museum',
        lat: 0, // Will be replaced dynamically
        lng: 0, // Will be replaced dynamically
      },
      startTime: '10:00',
      endTime: '12:00',
      description: 'Explore the rich history and cultural artifacts of the city.',
      cost: 1500, // in rupees
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3']
    },
    {
      id: '2',
      title: 'Local Food Tour',
      type: 'dining',
      location: {
        name: 'Central Market',
        lat: 0,
        lng: 0,
      },
      startTime: '13:00',
      endTime: '15:00',
      description: 'Taste authentic local cuisine with a knowledgeable guide.',
      cost: 2500,
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1535141192574-5d4897c12636']
    },
    {
      id: '3',
      title: 'Historic Temple Visit',
      type: 'sightseeing',
      location: {
        name: 'Ancient Temple',
        lat: 0,
        lng: 0,
      },
      startTime: '09:00',
      endTime: '11:00',
      description: 'Visit the sacred ancient temple with beautiful architecture.',
      cost: 500,
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1561361058-c24ceccc6dd6']
    },
    {
      id: '4',
      title: 'Evening Cultural Show',
      type: 'entertainment',
      location: {
        name: 'City Theater',
        lat: 0,
        lng: 0,
      },
      startTime: '19:00',
      endTime: '21:00',
      description: 'Experience traditional dance and music performances.',
      cost: 2000,
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1547366785-564103df7e13']
    },
    {
      id: '5',
      title: 'Sunrise Yoga Session',
      type: 'relaxation',
      location: {
        name: 'Riverside Park',
        lat: 0,
        lng: 0,
      },
      startTime: '06:00',
      endTime: '07:30',
      description: 'Start your day with a rejuvenating yoga session by the river.',
      cost: 800,
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1545205597-3d9d02c29597']
    },
    {
      id: '6',
      title: 'Local Craft Shopping',
      type: 'shopping',
      location: {
        name: 'Artisan Market',
        lat: 0,
        lng: 0,
      },
      startTime: '14:00',
      endTime: '16:00',
      description: 'Shop for authentic handmade crafts and souvenirs.',
      cost: 0, // free entry, shopping cost separate
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1555529902-5261034046f6']
    },
    {
      id: '7',
      title: 'Nature Hiking Trail',
      type: 'outdoors',
      location: {
        name: 'Hill Sanctuary',
        lat: 0,
        lng: 0,
      },
      startTime: '08:00',
      endTime: '12:00',
      description: 'Enjoy a refreshing hike through scenic nature trails.',
      cost: 300,
      currency: 'INR',
      pictures: ['https://images.unsplash.com/photo-1551632811-561732d1e306']
    }
  ];
};
