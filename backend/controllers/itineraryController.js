
const Itinerary = require('../models/Itinerary');

// Get all itineraries
exports.getAllItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find();
    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching itineraries', error: error.message });
  }
};

// Get a single itinerary by ID
exports.getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching itinerary', error: error.message });
  }
};

// Create a new itinerary
exports.createItinerary = async (req, res) => {
  try {
    // Calculate daily budget limit if not provided
    if (!req.body.preferences.budget.dailyLimit) {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      req.body.preferences.budget.dailyLimit = Math.round(req.body.preferences.budget.total / days);
    }
    
    const newItinerary = new Itinerary(req.body);
    const savedItinerary = await newItinerary.save();
    res.status(201).json(savedItinerary);
  } catch (error) {
    res.status(400).json({ message: 'Error creating itinerary', error: error.message });
  }
};

// Update an itinerary
exports.updateItinerary = async (req, res) => {
  try {
    const updatedItinerary = await Itinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.status(200).json(updatedItinerary);
  } catch (error) {
    res.status(400).json({ message: 'Error updating itinerary', error: error.message });
  }
};

// Delete an itinerary
exports.deleteItinerary = async (req, res) => {
  try {
    const deletedItinerary = await Itinerary.findByIdAndDelete(req.params.id);
    
    if (!deletedItinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    res.status(200).json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting itinerary', error: error.message });
  }
};

// Add activity to a day
exports.addActivity = async (req, res) => {
  try {
    const { itineraryId, dayId } = req.params;
    const activity = req.body;
    
    const itinerary = await Itinerary.findById(itineraryId);
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const day = itinerary.days.id(dayId);
    
    if (!day) {
      return res.status(404).json({ message: 'Day not found in itinerary' });
    }
    
    // Add activity
    day.activities.push(activity);
    
    // Calculate total cost for the day
    day.totalCost = day.activities.reduce((sum, act) => sum + (act.cost || 0), 0);
    
    // Check if day is over budget
    const dailyBudget = itinerary.preferences.budget.dailyLimit || 
                         (itinerary.preferences.budget.total / itinerary.days.length);
    
    day.isOverBudget = day.totalCost > dailyBudget;
    
    // Save the itinerary
    await itinerary.save();
    
    res.status(200).json({ 
      message: 'Activity added successfully', 
      day, 
      isOverBudget: day.isOverBudget
    });
  } catch (error) {
    res.status(400).json({ message: 'Error adding activity', error: error.message });
  }
};

// Remove activity from a day
exports.removeActivity = async (req, res) => {
  try {
    const { itineraryId, dayId, activityId } = req.params;
    
    const itinerary = await Itinerary.findById(itineraryId);
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    const day = itinerary.days.id(dayId);
    
    if (!day) {
      return res.status(404).json({ message: 'Day not found in itinerary' });
    }
    
    // Find and remove the activity
    const activityIndex = day.activities.findIndex(act => act._id.toString() === activityId);
    
    if (activityIndex === -1) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    day.activities.splice(activityIndex, 1);
    
    // Recalculate total cost for the day
    day.totalCost = day.activities.reduce((sum, act) => sum + (act.cost || 0), 0);
    
    // Check if day is over budget
    const dailyBudget = itinerary.preferences.budget.dailyLimit || 
                         (itinerary.preferences.budget.total / itinerary.days.length);
    
    day.isOverBudget = day.totalCost > dailyBudget;
    
    // Save the itinerary
    await itinerary.save();
    
    res.status(200).json({ 
      message: 'Activity removed successfully', 
      day,
      isOverBudget: day.isOverBudget
    });
  } catch (error) {
    res.status(400).json({ message: 'Error removing activity', error: error.message });
  }
};

// Calculate carbon footprint
exports.calculateCarbonFootprint = async (req, res) => {
  try {
    const { id } = req.params;
    
    const itinerary = await Itinerary.findById(id);
    
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    
    // Calculate total carbon footprint
    let totalCarbonFootprint = 0;
    
    // Sum activity footprints
    itinerary.days.forEach(day => {
      day.activities.forEach(activity => {
        totalCarbonFootprint += activity.carbonFootprint || 0;
      });
    });
    
    // Sum transportation footprints
    itinerary.transportations.forEach(transport => {
      totalCarbonFootprint += transport.carbonFootprint || 0;
    });
    
    // Sum accommodation footprints
    itinerary.accommodations.forEach(accommodation => {
      totalCarbonFootprint += accommodation.carbonFootprint || 0;
    });
    
    // Update and save
    itinerary.totalCarbonFootprint = totalCarbonFootprint;
    await itinerary.save();
    
    res.status(200).json({ 
      totalCarbonFootprint, 
      message: 'Carbon footprint calculated successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating carbon footprint', error: error.message });
  }
};
