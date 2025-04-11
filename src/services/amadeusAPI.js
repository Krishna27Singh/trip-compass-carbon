
// Amadeus API Service that communicates with our backend
const amadeusAPI = {
  // Get activities by location
  getActivitiesByLocation: async function(latitude, longitude, radius = 5) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/activities?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      
      if (!response.ok) {
        throw new Error('API returned an error');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }
};

export default amadeusAPI;
