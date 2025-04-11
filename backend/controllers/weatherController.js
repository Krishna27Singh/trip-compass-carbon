
const axios = require('axios');

// Get weather forecast for location and date
exports.getWeatherForecast = async (req, res) => {
  try {
    const { lat, lng, date, days = 7 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Use Weather API to get forecast
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lng}&days=${days}&aqi=no&alerts=no`
      );
      
      // Find the forecast that matches our target date or use current
      let weatherData;
      
      if (date) {
        const targetDate = date.substring(0, 10); // Format as YYYY-MM-DD
        const matchingDay = response.data.forecast.forecastday.find(
          day => day.date === targetDate
        );
        
        if (matchingDay) {
          weatherData = {
            date: matchingDay.date,
            condition: mapConditionToType(matchingDay.day.condition.text),
            temperature: matchingDay.day.avgtemp_c,
            precipitation: matchingDay.day.daily_chance_of_rain
          };
        }
      }
      
      // If no date provided or no matching forecast found, use current weather
      if (!weatherData) {
        weatherData = {
          date: new Date().toISOString().split('T')[0],
          condition: mapConditionToType(response.data.current.condition.text),
          temperature: response.data.current.temp_c,
          precipitation: response.data.current.precip_mm > 0 ? 100 : 0
        };
      }
      
      res.json(weatherData);
    } catch (apiError) {
      console.error('Error from Weather API:', apiError);
      
      // Return fallback weather data if the API call fails
      res.json({
        date: date || new Date().toISOString().split('T')[0],
        condition: 'cloudy',
        temperature: 20,
        precipitation: 0
      });
    }
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ message: 'Error fetching weather', error: error.message });
  }
};

// Map the weather condition text to one of our defined types
function mapConditionToType(conditionText) {
  const lowerCaseCondition = conditionText.toLowerCase();
  
  if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
    return 'sunny';
  } else if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle') || lowerCaseCondition.includes('shower')) {
    return 'rainy';
  } else if (lowerCaseCondition.includes('cloud') || lowerCaseCondition.includes('overcast')) {
    return 'cloudy';
  } else if (lowerCaseCondition.includes('snow') || lowerCaseCondition.includes('sleet') || lowerCaseCondition.includes('ice')) {
    return 'snowy';
  } else if (lowerCaseCondition.includes('thunder') || lowerCaseCondition.includes('storm')) {
    return 'stormy';
  }
  
  // Default to cloudy if we can't determine the condition
  return 'cloudy';
}
