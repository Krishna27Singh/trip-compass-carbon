
export type TravelPreference = 
  | 'adventure' 
  | 'relaxation' 
  | 'culture' 
  | 'nightlife' 
  | 'nature' 
  | 'art' 
  | 'food';

export type TravelPace = 'relaxed' | 'moderate' | 'busy';

export type TransportationType = 
  | 'walking' 
  | 'bicycle' 
  | 'car' 
  | 'bus' 
  | 'train' 
  | 'plane';

export type WeatherCondition = 
  | 'sunny' 
  | 'cloudy' 
  | 'rainy' 
  | 'stormy' 
  | 'snowy';

export type ActivityType = 
  | 'sightseeing' 
  | 'museum' 
  | 'outdoors' 
  | 'dining' 
  | 'shopping' 
  | 'entertainment' 
  | 'relaxation'
  | 'freeTime';

export interface Location {
  id: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  description?: string;
  imageUrl?: string;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  location: Location;
  startTime: string;
  endTime: string;
  description?: string;
  cost?: number;
  carbonFootprint?: number;
  weatherSensitive?: boolean;
  alternativeActivities?: Activity[];
}

export interface Day {
  id: string;
  date: string;
  activities: Activity[];
  totalCost?: number;
  isOverBudget?: boolean;
}

export interface Transportation {
  id: string;
  type: TransportationType;
  from: Location;
  to: Location;
  departureTime: string;
  arrivalTime: string;
  cost?: number;
  carbonFootprint: number;
}

export interface Accommodation {
  id: string;
  name: string;
  location: Location;
  checkIn: string;
  checkOut: string;
  cost?: number;
  carbonFootprint: number;
}

export interface Budget {
  total: number;
  accommodations: number;
  transportation: number;
  activities: number;
  food: number;
  misc: number;
  dailyLimit?: number;
  currency: string;
}

export interface TripPreferences {
  preferences: TravelPreference[];
  pace: TravelPace;
  budget: Budget;
}

export interface Itinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: Day[];
  accommodations: Accommodation[];
  transportations: Transportation[];
  preferences: TripPreferences;
  totalCarbonFootprint: number;
}
