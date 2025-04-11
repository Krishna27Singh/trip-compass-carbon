
const Destination = require('../models/Destination');

// Get all popular destinations
exports.getPopularDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().limit(10);
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
};

// Search destinations
exports.searchDestinations = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const destinations = await Destination.find({
      name: { $regex: query, $options: 'i' }
    }).limit(10);
    
    res.json(destinations);
  } catch (error) {
    console.error('Error searching destinations:', error);
    res.status(500).json({ message: 'Error searching destinations', error: error.message });
  }
};

// Add a new destination
exports.addDestination = async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (error) {
    console.error('Error adding destination:', error);
    res.status(500).json({ message: 'Error adding destination', error: error.message });
  }
};

// Add multiple destinations (for seeding data)
exports.addMultipleDestinations = async (req, res) => {
  try {
    const { destinations } = req.body;
    
    if (!destinations || !Array.isArray(destinations)) {
      return res.status(400).json({ message: 'Valid destinations array is required' });
    }
    
    const savedDestinations = await Destination.insertMany(destinations);
    res.status(201).json({ message: `${savedDestinations.length} destinations added`, destinations: savedDestinations });
  } catch (error) {
    console.error('Error adding multiple destinations:', error);
    res.status(500).json({ message: 'Error adding destinations', error: error.message });
  }
};
