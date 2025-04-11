
const Destination = require('../models/Destination');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
};

// Search destinations
exports.searchDestinations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }
    
    const regex = new RegExp(query, 'i');
    
    const destinations = await Destination.find({
      $or: [
        { name: regex },
        { country: regex }
      ]
    }).limit(5);
    
    res.status(200).json(destinations);
  } catch (error) {
    res.status(500).json({ message: 'Error searching destinations', error: error.message });
  }
};

// Get destination by ID
exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.status(200).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching destination', error: error.message });
  }
};

// Create a new destination
exports.createDestination = async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    res.status(400).json({ message: 'Error creating destination', error: error.message });
  }
};

// Seed initial destinations (for development)
exports.seedDestinations = async (req, res) => {
  try {
    // Check if we already have destinations
    const count = await Destination.countDocuments();
    
    if (count > 0) {
      return res.status(400).json({ message: 'Destinations already exist in the database' });
    }
    
    // Initial list of 50+ destinations with data
    const destinations = [
      {
        name: 'Paris',
        country: 'France',
        lat: 48.8566,
        lng: 2.3522,
        description: 'The City of Light, known for its art, culture, and cuisine.',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        tags: ['culture', 'art', 'food', 'romance']
      },
      {
        name: 'Tokyo',
        country: 'Japan',
        lat: 35.6762,
        lng: 139.6503,
        description: 'A bustling metropolis that combines ultramodern with traditional.',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
        tags: ['culture', 'food', 'shopping', 'technology']
      },
      {
        name: 'New York',
        country: 'United States',
        lat: 40.7128,
        lng: -74.0060,
        description: 'The Big Apple, a global center for art, fashion, finance, and culture.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9',
        tags: ['culture', 'shopping', 'art', 'nightlife']
      },
      {
        name: 'Rome',
        country: 'Italy',
        lat: 41.9028,
        lng: 12.4964,
        description: 'The Eternal City, with ancient ruins, art, and delicious cuisine.',
        image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198',
        tags: ['culture', 'history', 'food', 'art']
      },
      {
        name: 'Sydney',
        country: 'Australia',
        lat: -33.8688,
        lng: 151.2093,
        description: 'Harbor city known for its iconic Opera House and beautiful beaches.',
        image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9',
        tags: ['beach', 'nature', 'outdoors', 'relaxation']
      },
      {
        name: 'London',
        country: 'United Kingdom',
        lat: 51.5074,
        lng: -0.1278,
        description: 'A diverse and vibrant city with a rich history and cultural scene.',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad',
        tags: ['culture', 'history', 'shopping', 'art']
      },
      {
        name: 'Barcelona',
        country: 'Spain',
        lat: 41.3851,
        lng: 2.1734,
        description: 'Known for stunning architecture, art, and a lively beach scene.',
        image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216',
        tags: ['beach', 'culture', 'architecture', 'food']
      },
      {
        name: 'Bangkok',
        country: 'Thailand',
        lat: 13.7563,
        lng: 100.5018,
        description: 'Vibrant city known for ornate shrines, street food, and bustling markets.',
        image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0d5',
        tags: ['culture', 'food', 'shopping', 'nightlife']
      },
      {
        name: 'Mumbai',
        country: 'India',
        lat: 19.0760,
        lng: 72.8777,
        description: 'The financial capital of India, known for its colonial architecture and Bollywood.',
        image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c',
        tags: ['culture', 'food', 'history', 'entertainment']
      },
      {
        name: 'Delhi',
        country: 'India',
        lat: 28.6139,
        lng: 77.2090,
        description: 'India\'s capital territory, with a rich history spanning thousands of years.',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5',
        tags: ['culture', 'history', 'food', 'shopping']
      },
      {
        name: 'Goa',
        country: 'India',
        lat: 15.2993,
        lng: 74.1240,
        description: 'Known for its beaches, vibrant nightlife, and Portuguese-influenced architecture.',
        image: 'https://images.unsplash.com/photo-1618550917339-5a1978e8a105',
        tags: ['beach', 'relaxation', 'nightlife', 'food']
      },
      {
        name: 'Jaipur',
        country: 'India',
        lat: 26.9124,
        lng: 75.7873,
        description: 'The Pink City, known for its stunning palaces, forts, and colorful bazaars.',
        image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a',
        tags: ['culture', 'history', 'shopping', 'architecture']
      },
      {
        name: 'Agra',
        country: 'India',
        lat: 27.1767,
        lng: 78.0081,
        description: 'Home to the iconic Taj Mahal, one of the Seven Wonders of the World.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
        tags: ['culture', 'history', 'architecture', 'romance']
      },
      {
        name: 'Kolkata',
        country: 'India',
        lat: 22.5726,
        lng: 88.3639,
        description: 'Cultural capital of India with a rich literary and artistic heritage.',
        image: 'https://images.unsplash.com/photo-1563448927992-9e8a2c732c3d',
        tags: ['culture', 'history', 'food', 'art']
      },
      {
        name: 'Varanasi',
        country: 'India',
        lat: 25.3176,
        lng: 82.9739,
        description: 'One of the world\'s oldest continually inhabited cities, sacred to Hindus.',
        image: 'https://images.unsplash.com/photo-1561361058-c24ceccc6dd6',
        tags: ['culture', 'spirituality', 'history', 'food']
      },
      // Add 35+ more destinations here
    ];
    
    await Destination.insertMany(destinations);
    
    res.status(201).json({ message: 'Destinations seeded successfully', count: destinations.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding destinations', error: error.message });
  }
};
