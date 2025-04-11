
import axios from 'axios';
import { Destination, Activity, Itinerary, Day } from '@/types/itinerary';

// API base URL
const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Destinations API
export const getAllDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await api.get('/destinations');
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
};

export const searchDestinations = async (query: string): Promise<Destination[]> => {
  try {
    const response = await api.get(`/destinations/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching destinations:', error);
    return [];
  }
};

// Activities API
export const getActivitiesForDestination = async (destinationId: string): Promise<Activity[]> => {
  try {
    const response = await api.get(`/activities/destination/${destinationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const getActivitiesByLocation = async (lat: number, lng: number): Promise<Activity[]> => {
  try {
    const response = await api.get(`/activities/location?lat=${lat}&lng=${lng}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching activities by location:', error);
    return [];
  }
};

// Itineraries API
export const getAllItineraries = async (): Promise<Itinerary[]> => {
  try {
    const response = await api.get('/itineraries');
    return response.data;
  } catch (error) {
    console.error('Error fetching itineraries:', error);
    return [];
  }
};

export const getItineraryById = async (id: string): Promise<Itinerary | null> => {
  try {
    const response = await api.get(`/itineraries/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    return null;
  }
};

export const createItinerary = async (itinerary: Partial<Itinerary>): Promise<Itinerary | null> => {
  try {
    const response = await api.post('/itineraries', itinerary);
    return response.data;
  } catch (error) {
    console.error('Error creating itinerary:', error);
    return null;
  }
};

export const updateItinerary = async (id: string, updates: Partial<Itinerary>): Promise<Itinerary | null> => {
  try {
    const response = await api.put(`/itineraries/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating itinerary:', error);
    return null;
  }
};

export const addActivityToDay = async (
  itineraryId: string, 
  dayId: string, 
  activity: Partial<Activity>
): Promise<{ day: Day; isOverBudget: boolean } | null> => {
  try {
    const response = await api.post(
      `/itineraries/${itineraryId}/days/${dayId}/activities`, 
      activity
    );
    return response.data;
  } catch (error) {
    console.error('Error adding activity:', error);
    return null;
  }
};

export const removeActivityFromDay = async (
  itineraryId: string, 
  dayId: string, 
  activityId: string
): Promise<{ day: Day; isOverBudget: boolean } | null> => {
  try {
    const response = await api.delete(
      `/itineraries/${itineraryId}/days/${dayId}/activities/${activityId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error removing activity:', error);
    return null;
  }
};

// Weather API
export const getWeatherForecast = async (lat: number, lng: number, days: number = 7) => {
  try {
    const response = await api.get(`/weather/forecast?lat=${lat}&lng=${lng}&days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

export default {
  getAllDestinations,
  searchDestinations,
  getActivitiesForDestination,
  getActivitiesByLocation,
  getAllItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  addActivityToDay,
  removeActivityFromDay,
  getWeatherForecast
};
