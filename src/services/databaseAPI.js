
// Mock database service (in a real app, this would be a backend API)
// For this demo, we'll use localStorage to simulate a database
const databaseAPI = {
  // Save itinerary to localStorage
  saveItinerary: function(itinerary) {
    try {
      // Get existing itineraries
      let itineraries = this.getAllItineraries();
      
      // Add or update the itinerary
      const existingIndex = itineraries.findIndex(item => item.id === itinerary.id);
      
      if (existingIndex >= 0) {
        // Update existing
        itineraries[existingIndex] = itinerary;
      } else {
        // Add new
        itineraries.push(itinerary);
      }
      
      // Save to localStorage
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
      return itinerary;
    } catch (error) {
      console.error('Error saving itinerary:', error);
      throw error;
    }
  },
  
  // Get all itineraries
  getAllItineraries: function() {
    try {
      const itineraries = localStorage.getItem('itineraries');
      return itineraries ? JSON.parse(itineraries) : [];
    } catch (error) {
      console.error('Error getting itineraries:', error);
      return [];
    }
  },
  
  // Get itinerary by ID
  getItineraryById: function(id) {
    try {
      const itineraries = this.getAllItineraries();
      return itineraries.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Error getting itinerary:', error);
      return null;
    }
  },
  
  // Delete itinerary
  deleteItinerary: function(id) {
    try {
      let itineraries = this.getAllItineraries();
      itineraries = itineraries.filter(item => item.id !== id);
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
      return true;
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      return false;
    }
  }
};

export default databaseAPI;
