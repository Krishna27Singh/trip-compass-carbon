
import { Location, Activity, ActivityType } from '@/types/itinerary';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Configure API base URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? '/api' 
  : 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface WeatherForecast {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  temperature: number;
  precipitation: number;
}

// API functions
export const getPopularDestinations = async (): Promise<Location[]> => {
  try {
    const response = await api.get('/destinations/popular');
    return response.data;
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    return [];
  }
};

export const searchDestinations = async (query: string): Promise<Location[]> => {
  try {
    const response = await api.get(`/destinations/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching destinations:', error);
    return [];
  }
};

export const getActivitiesForDestination = async (destinationName: string): Promise<Activity[]> => {
  try {
    const response = await api.get(`/activities?destination=${destinationName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities for destination:', error);
    return [];
  }
};

export const getWeatherForecast = async (lat: number, lng: number, date: string): Promise<WeatherForecast> => {
  try {
    const response = await api.get(`/weather?lat=${lat}&lng=${lng}&date=${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return fallback weather if API fails
    return {
      date,
      condition: 'cloudy',
      temperature: 20,
      precipitation: 0
    };
  }
};
