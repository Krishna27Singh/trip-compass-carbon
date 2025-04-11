
// Weather API Service that communicates with our backend
const weatherAPI = {
  getWeatherForecast: async function(latitude, longitude, days = 7) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?lat=${latitude}&lng=${longitude}&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error('Weather API returned an error');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  },
  
  // Get weather conditions for a specific date
  getWeatherForDate: async function(latitude, longitude, date) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/weather?lat=${latitude}&lng=${longitude}&date=${date}`
      );
      
      if (!response.ok) {
        throw new Error('Weather API returned an error');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting weather for date:', error);
      return null;
    }
  }
};

export default weatherAPI;
