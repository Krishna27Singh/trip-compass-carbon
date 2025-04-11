
import { Location, Activity } from '@/types/itinerary';
import { v4 as uuidv4 } from 'uuid';

// This is a mock API service for demo purposes
// In a real app, you would use actual API calls to services like Google Places, TripAdvisor, etc.

// Mock data for popular destinations
const popularDestinations: Location[] = [
  {
    id: uuidv4(),
    name: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    description: 'The City of Light',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    description: 'A fascinating blend of the ultramodern and the traditional',
    imageUrl: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    description: 'The city that never sleeps',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Barcelona',
    lat: 41.3851,
    lng: 2.1734,
    description: 'Home of stunning architecture and beautiful beaches',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: uuidv4(),
    name: 'Sydney',
    lat: -33.8688,
    lng: 151.2093,
    description: 'Famous for its harbor and beautiful opera house',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=2070&auto=format&fit=crop'
  }
];

// Mock activities for various cities
const mockActivities: Record<string, Activity[]> = {
  'Paris': [
    {
      id: uuidv4(),
      title: 'Visit the Eiffel Tower',
      type: 'sightseeing',
      location: {
        id: uuidv4(),
        name: 'Eiffel Tower',
        lat: 48.8584,
        lng: 2.2945,
        address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France'
      },
      startTime: '09:00',
      endTime: '11:30',
      description: 'Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.',
      cost: 25,
      carbonFootprint: 5,
      weatherSensitive: false
    },
    {
      id: uuidv4(),
      title: 'Louvre Museum',
      type: 'museum',
      location: {
        id: uuidv4(),
        name: 'Louvre Museum',
        lat: 48.8606,
        lng: 2.3376,
        address: 'Rue de Rivoli, 75001 Paris, France'
      },
      startTime: '13:00',
      endTime: '17:00',
      description: 'Explore one of the world\'s largest art museums, home to thousands of works of art including the Mona Lisa.',
      cost: 17,
      carbonFootprint: 4,
      weatherSensitive: false
    },
    {
      id: uuidv4(),
      title: 'Seine River Cruise',
      type: 'entertainment',
      location: {
        id: uuidv4(),
        name: 'Bateaux Parisiens',
        lat: 48.8530,
        lng: 2.3499,
        address: 'Port de la Bourdonnais, 75007 Paris, France'
      },
      startTime: '19:00',
      endTime: '21:00',
      description: 'Enjoy a beautiful sunset cruise on the Seine River, seeing Paris from a different perspective.',
      cost: 15,
      carbonFootprint: 8,
      weatherSensitive: true
    }
  ],
  'Tokyo': [
    {
      id: uuidv4(),
      title: 'Visit Meiji Shrine',
      type: 'sightseeing',
      location: {
        id: uuidv4(),
        name: 'Meiji Shrine',
        lat: 35.6763,
        lng: 139.6993,
        address: '1-1 Yoyogikamizonocho, Shibuya City, Tokyo 151-8557, Japan'
      },
      startTime: '09:00',
      endTime: '11:00',
      description: 'Visit the Meiji Shrine, a peaceful Shinto shrine dedicated to Emperor Meiji and Empress Shoken.',
      cost: 0,
      carbonFootprint: 3,
      weatherSensitive: true
    },
    {
      id: uuidv4(),
      title: 'Explore Shibuya Crossing',
      type: 'sightseeing',
      location: {
        id: uuidv4(),
        name: 'Shibuya Crossing',
        lat: 35.6597,
        lng: 139.7004,
        address: '2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan'
      },
      startTime: '14:00',
      endTime: '16:00',
      description: 'Experience the famous Shibuya Crossing, one of the busiest intersections in the world.',
      cost: 0,
      carbonFootprint: 2,
      weatherSensitive: false
    },
    {
      id: uuidv4(),
      title: 'Sushi Dinner in Ginza',
      type: 'dining',
      location: {
        id: uuidv4(),
        name: 'Sukiyabashi Jiro',
        lat: 35.6729,
        lng: 139.7648,
        address: '4 Chome-2-15 Ginza, Chuo City, Tokyo 104-0061, Japan'
      },
      startTime: '19:00',
      endTime: '21:00',
      description: 'Enjoy an authentic sushi dinner experience in the upscale Ginza district.',
      cost: 300,
      carbonFootprint: 10,
      weatherSensitive: false
    }
  ],
  'New York': [
    {
      id: uuidv4(),
      title: 'Visit Times Square',
      type: 'sightseeing',
      location: {
        id: uuidv4(),
        name: 'Times Square',
        lat: 40.7580,
        lng: -73.9855,
        address: 'Manhattan, NY 10036, United States'
      },
      startTime: '10:00',
      endTime: '12:00',
      description: 'Experience the bright lights and bustling atmosphere of Times Square.',
      cost: 0,
      carbonFootprint: 3,
      weatherSensitive: false
    },
    {
      id: uuidv4(),
      title: 'Metropolitan Museum of Art',
      type: 'museum',
      location: {
        id: uuidv4(),
        name: 'The Met',
        lat: 40.7794,
        lng: -73.9632,
        address: '1000 5th Ave, New York, NY 10028, United States'
      },
      startTime: '13:00',
      endTime: '17:00',
      description: 'Explore one of the world\'s largest and finest art museums with over 2 million works of art.',
      cost: 25,
      carbonFootprint: 4,
      weatherSensitive: false
    },
    {
      id: uuidv4(),
      title: 'Central Park Walk',
      type: 'outdoors',
      location: {
        id: uuidv4(),
        name: 'Central Park',
        lat: 40.7812,
        lng: -73.9665,
        address: 'New York, NY, United States'
      },
      startTime: '18:00',
      endTime: '20:00',
      description: 'Take a relaxing walk through Central Park, an urban oasis in the heart of Manhattan.',
      cost: 0,
      carbonFootprint: 1,
      weatherSensitive: true
    }
  ]
};

// Mock API functions
export const getPopularDestinations = async (): Promise<Location[]> => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(popularDestinations);
    }, 500);
  });
};

export const searchDestinations = async (query: string): Promise<Location[]> => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      const results = popularDestinations.filter(destination => 
        destination.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(results);
    }, 500);
  });
};

export const getActivitiesForDestination = async (destinationName: string): Promise<Activity[]> => {
  // Simulate API call
  return new Promise(resolve => {
    setTimeout(() => {
      const activities = mockActivities[destinationName] || [];
      resolve(activities);
    }, 800);
  });
};

export const getWeatherForecast = async (lat: number, lng: number, date: string): Promise<WeatherForecast> => {
  // In a real app, this would call a weather API
  return new Promise(resolve => {
    setTimeout(() => {
      // Generate random weather
      const weatherTypes: WeatherForecast['condition'][] = ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'];
      const randomIndex = Math.floor(Math.random() * weatherTypes.length);
      
      resolve({
        date,
        condition: weatherTypes[randomIndex],
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
        precipitation: Math.floor(Math.random() * 100) // 0-100%
      });
    }, 600);
  });
};

export interface WeatherForecast {
  date: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  temperature: number;
  precipitation: number;
}
