
// Amadeus API Service that communicates with our backend
const amadeusAPI = {
  // Get activities by location
  getActivitiesByLocation: async function(latitude, longitude, radius = 5) {
    try {
      console.log(`Fetching activities for coordinates: lat=${latitude}, lng=${longitude}, radius=${radius}`);
      const response = await fetch(
        `/api/activities?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`API returned an error: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('Activity data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  },
  
  // Get activities by destination name
  getActivitiesByDestination: async function(destinationName) {
    try {
      console.log(`Fetching activities for destination: ${destinationName}`);
      const response = await fetch(
        `/api/activities?destination=${encodeURIComponent(destinationName)}`
      );
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API error response:', errorData);
        throw new Error(`API returned an error: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('Activity data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching activities by destination:', error);
      return [];
    }
  }
};

export default amadeusAPI;
