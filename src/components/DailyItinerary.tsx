
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useItinerary } from '@/contexts/ItineraryContext';
import { Day, Activity } from '@/types/itinerary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CloudSun } from 'lucide-react';
import ActivityItem from './ActivityItem';
import { WeatherForecast, getWeatherForecast } from '@/services/api';

interface DailyItineraryProps {
  day: Day;
  onAddActivity: (dayId: string) => void;
}

const DailyItinerary: React.FC<DailyItineraryProps> = ({ day, onAddActivity }) => {
  const { removeActivity } = useItinerary();
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  
  // Format the day of the week and date
  const formattedDate = (() => {
    try {
      const date = new Date(day.date);
      return {
        dayOfWeek: format(date, 'EEEE'),
        fullDate: format(date, 'MMMM d, yyyy')
      };
    } catch (error) {
      return {
        dayOfWeek: 'Invalid Date',
        fullDate: 'Please check the date format'
      };
    }
  })();
  
  // Check weather for the day's location
  const checkWeather = async () => {
    if (day.activities.length === 0) return;
    
    try {
      setIsWeatherLoading(true);
      // Use the first activity's location for weather
      const firstActivity = day.activities[0];
      const weather = await getWeatherForecast(
        firstActivity.location.lat,
        firstActivity.location.lng,
        day.date
      );
      setWeather(weather);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setIsWeatherLoading(false);
    }
  };
  
  // Render weather information
  const renderWeather = () => {
    if (isWeatherLoading) {
      return <div className="text-sm text-gray-500">Loading weather...</div>;
    }
    
    if (!weather) {
      return (
        <Button variant="outline" size="sm" onClick={checkWeather} className="text-xs bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100">
          <CloudSun className="h-3.5 w-3.5 mr-1" />
          Check Weather
        </Button>
      );
    }
    
    const weatherIcons: Record<string, string> = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      stormy: '⛈️',
      snowy: '❄️'
    };
    
    return (
      <div className="flex items-center text-sm bg-teal-50 text-teal-700 px-2 py-1 rounded-md">
        <span className="mr-1">{weatherIcons[weather.condition] || '🌡️'}</span>
        <span>{weather.temperature}°C, {weather.condition}</span>
      </div>
    );
  };
  
  return (
    <Card className="mb-6 border-teal-100 shadow-sm">
      <CardHeader className="pb-2 bg-teal-50">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-teal-700">{formattedDate.dayOfWeek}</CardTitle>
            <p className="text-sm text-teal-600">{formattedDate.fullDate}</p>
          </div>
          {renderWeather()}
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {day.activities.length > 0 ? (
          <div className="space-y-3">
            {day.activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                showDetails
                onDelete={() => removeActivity(day.id, activity.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-teal-50/50 rounded-lg border border-dashed border-teal-200">
            <p className="text-teal-600 mb-4">No activities planned for this day yet.</p>
          </div>
        )}
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-teal-300 text-teal-700 hover:bg-teal-50" 
          onClick={() => onAddActivity(day.id)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyItinerary;
