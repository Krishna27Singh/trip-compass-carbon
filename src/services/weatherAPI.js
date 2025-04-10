
// Weather API Service
const weatherAPI = {
  apiKey: '21a7c32090574b6ea7865606251004',
  
  getWeatherForecast: async function(latitude, longitude, days = 7) {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${latitude},${longitude}&days=${days}&aqi=no&alerts=no`
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
      // Get forecast for the next 7 days
      const forecast = await this.getWeatherForecast(latitude, longitude);
      
      if (!forecast || !forecast.forecast || !forecast.forecast.forecastday) {
        return null;
      }
      
      // Find the day that matches our target date
      const targetDate = date.substring(0, 10); // Format as YYYY-MM-DD
      const matchingDay = forecast.forecast.forecastday.find(
        day => day.date === targetDate
      );
      
      return matchingDay || null;
    } catch (error) {
      console.error('Error getting weather for date:', error);
      return null;
    }
  }
};

export default weatherAPI;
